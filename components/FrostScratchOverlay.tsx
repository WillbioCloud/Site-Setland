import { useEffect, useRef, type RefObject } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type FrostMode = 'hero' | 'card';

export interface FrostScratchOverlayProps {
  /** `hero` covers the full-bleed video; `card` covers a photo frame. */
  mode: FrostMode;
  /**
   * Element whose pointer movement thaws the frost. Listening on an ancestor keeps the canvas
   * `pointer-events: none`, so clicks on the card or the hero text still reach their targets.
   * Defaults to the frame that contains the overlay.
   */
  interactionRef?: RefObject<HTMLElement | null>;
  /** Called once, the first time the visitor thaws part of the surface. */
  onFirstThaw?: () => void;
}

type FrostState = 'clear' | 'freezing' | 'frozen';
type Point = { x: number; y: number };

interface FrostProfile {
  /** Visible time before any frost forms (ms). */
  clearMs: number;
  /** Time for the frost front to travel from the edges to the centre (ms). */
  freezeMs: number;
  /** Brush radius as a share of the shorter side, clamped to [brushMin, brushMax] CSS pixels. */
  brushRatio: number;
  brushMin: number;
  brushMax: number;
  /** Cap on the backing store, so a large hero stays cheap on weak GPUs. */
  maxPixels: number;
  maxDpr: number;
  /** Backing width divided by this gives the resolution of the blurred photo copy. */
  blurDivisor: number;
  /** Box-blur radius (in blurred-copy pixels) applied per pass; three passes approximate a Gaussian. */
  blurRadius: number;
  /** Frame colour shown until the first photo is decoded. */
  base: string;
  tint: string;
  rim: string;
  halo: string;
  crystal: string;
  /** One fern crystal per this many CSS pixels squared. */
  fernArea: number;
  glints: number;
}

const PROFILES: Record<FrostMode, FrostProfile> = {
  hero: {
    clearMs: 2800,
    freezeMs: 2000,
    brushRatio: 0.11,
    brushMin: 48,
    brushMax: 110,
    maxPixels: 1_600_000,
    maxDpr: 1.5,
    blurDivisor: 11,
    blurRadius: 2,
    base: '#071827',
    tint: 'rgb(6 22 36 / 58%)',
    rim: 'rgb(186 230 253 / 34%)',
    halo: 'rgb(190 225 250 / 14%)',
    crystal: 'rgb(226 244 255 / 30%)',
    fernArea: 9000,
    glints: 240,
  },
  card: {
    clearMs: 2500,
    freezeMs: 1600,
    brushRatio: 0.28,
    brushMin: 28,
    brushMax: 60,
    maxPixels: 700_000,
    maxDpr: 2,
    blurDivisor: 9,
    blurRadius: 3,
    base: '#16303f',
    tint: 'rgb(191 230 250 / 20%)',
    rim: 'rgb(255 255 255 / 30%)',
    halo: 'rgb(255 255 255 / 16%)',
    crystal: 'rgb(255 255 255 / 40%)',
    fernArea: 2600,
    glints: 70,
  },
};

/** Frost thaws only once it has formed enough to be worth scratching. */
const MIN_THAW_PROGRESS = 0.12;
/** Idle time before a thawed area starts to refreeze (ms). */
const REFREEZE_IDLE_MS = 6000;
/** Duration of the refreeze fade once it starts (ms). */
const REFREEZE_MS = 7000;
/** Resolution of the thaw mask relative to the backing store. Strokes stay cheap at this size. */
const THAW_SCALE = 0.25;
const RESIZE_DEBOUNCE_MS = 120;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

let instanceCounter = 0;

function createSurface(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  return canvas.getContext('2d');
}

/** Small seeded PRNG so each overlay gets a stable, distinct frost pattern. */
function createRandom(seed: number) {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Segment = [number, number, number, number, number];

/** Grows one fern: a tapering stem that splits into branches, with the odd side shoot. */
function growFern(
  out: Segment[],
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number,
  width: number,
  random: () => number,
) {
  if (depth <= 0 || length < 2) return;
  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;
  out.push([x, y, x2, y2, width]);
  const spread = 0.4 + random() * 0.5;
  const next = length * (0.6 + random() * 0.18);
  const childWidth = width * 0.7;
  growFern(out, x2, y2, angle - spread, next, depth - 1, childWidth, random);
  growFern(
    out,
    x2,
    y2,
    angle + spread * (0.85 + random() * 0.3),
    next * (0.85 + random() * 0.2),
    depth - 1,
    childWidth,
    random,
  );
  if (depth >= 3 && random() < 0.45) {
    growFern(
      out,
      x2,
      y2,
      angle + (random() - 0.5) * 0.9,
      next * 0.6,
      depth - 2,
      childWidth * 0.6,
      random,
    );
  }
}

/** Static frost texture: tinted base, rim glow, fern crystals, facets and glints. */
function buildFrostTexture(
  width: number,
  height: number,
  cssWidth: number,
  cssHeight: number,
  profile: FrostProfile,
  mode: FrostMode,
  seed: number,
): HTMLCanvasElement | null {
  const canvas = createSurface(width, height);
  const g = getContext(canvas);
  if (!g) return null;
  const random = createRandom(seed);
  const scale = width / cssWidth;

  g.fillStyle = profile.tint;
  g.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const rim = g.createRadialGradient(
    cx,
    cy,
    Math.min(width, height) * 0.22,
    cx,
    cy,
    Math.hypot(cx, cy),
  );
  rim.addColorStop(0, 'rgb(255 255 255 / 0%)');
  rim.addColorStop(1, profile.rim);
  g.fillStyle = rim;
  g.fillRect(0, 0, width, height);

  if (mode === 'hero') {
    // Deepen the frost behind the copy so small text stays legible. It lives in the frost layer,
    // so the photo revealed by scratching is untouched.
    const footer = g.createLinearGradient(0, height * 0.45, 0, height);
    footer.addColorStop(0, 'rgb(5 14 24 / 0%)');
    footer.addColorStop(1, 'rgb(5 14 24 / 55%)');
    g.fillStyle = footer;
    g.fillRect(0, 0, width, height);
    const column = g.createRadialGradient(
      width * 0.3,
      height * 0.5,
      0,
      width * 0.3,
      height * 0.5,
      width * 0.42,
    );
    column.addColorStop(0, 'rgb(5 14 24 / 36%)');
    column.addColorStop(1, 'rgb(5 14 24 / 0%)');
    g.fillStyle = column;
    g.fillRect(0, 0, width, height);
  }

  // Frost grows from the edges first, so most crystal seeds sit on the perimeter.
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const ferns = Math.round((cssWidth * cssHeight) / profile.fernArea);
  for (let i = 0; i < ferns; i++) {
    let x: number;
    let y: number;
    if (random() < 0.65) {
      const side = Math.floor(random() * 4);
      if (side === 0) {
        x = random() * width;
        y = 0;
      } else if (side === 1) {
        x = width;
        y = random() * height;
      } else if (side === 2) {
        x = random() * width;
        y = height;
      } else {
        x = 0;
        y = random() * height;
      }
    } else {
      x = random() * width;
      y = random() * height;
    }
    const segments: Segment[] = [];
    growFern(
      segments,
      x,
      y,
      random() * Math.PI * 2,
      (mode === 'hero' ? 70 : 34) * scale * (0.6 + random() * 0.8),
      3 + Math.floor(random() * 2),
      (mode === 'hero' ? 1.6 : 1.2) * scale * (0.6 + random() * 0.6),
      random,
    );
    // Soft halo first, then a thin bright core, so the crystals read as frost rather than wire.
    g.strokeStyle = profile.halo;
    for (const [x1, y1, x2, y2, lineWidth] of segments) {
      g.lineWidth = lineWidth * 3.4;
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.stroke();
    }
    g.strokeStyle = profile.crystal;
    for (const [x1, y1, x2, y2, lineWidth] of segments) {
      g.lineWidth = lineWidth;
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.stroke();
    }
  }

  const facets = Math.round((cssWidth * cssHeight) / (mode === 'hero' ? 60000 : 16000));
  for (let i = 0; i < facets; i++) {
    const x = random() * width;
    const y = random() * height;
    const s = (mode === 'hero' ? 140 : 70) * scale * (0.5 + random());
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + s * (random() - 0.2), y + s * (0.2 + random() * 0.8));
    g.lineTo(x + s * (0.2 + random() * 0.8), y + s * (random() - 0.3));
    g.closePath();
    const facet = g.createLinearGradient(x, y, x + s, y + s);
    facet.addColorStop(0, 'rgb(255 255 255 / 6%)');
    facet.addColorStop(1, 'rgb(255 255 255 / 0%)');
    g.fillStyle = facet;
    g.fill();
  }

  for (let i = 0; i < profile.glints; i++) {
    g.fillStyle = `rgb(255 255 255 / ${Math.round(30 + random() * 60)}%)`;
    g.beginPath();
    g.arc(random() * width, random() * height, (0.6 + random() * 1.4) * scale, 0, Math.PI * 2);
    g.fill();
  }

  return canvas;
}

/**
 * Separable box blur with clamped edges, three passes. Clamping keeps the border opaque, so the
 * blurred copy never fades into the photo underneath at the edges of the frame.
 */
function boxBlurLines(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
  horizontal: boolean,
) {
  const length = horizontal ? width : height;
  const lines = horizontal ? height : width;
  const span = radius * 2 + 1;
  const clampIndex = (i: number) => Math.min(length - 1, Math.max(0, i));
  for (let line = 0; line < lines; line++) {
    const offset = (i: number) => (horizontal ? line * width + i : i * width + line) * 4;
    for (let channel = 0; channel < 4; channel++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        sum += src[offset(clampIndex(k)) + channel];
      }
      for (let i = 0; i < length; i++) {
        dst[offset(i) + channel] = sum / span;
        sum +=
          src[offset(clampIndex(i + radius + 1)) + channel] -
          src[offset(clampIndex(i - radius)) + channel];
      }
    }
  }
}

function boxBlurRGBA(data: Uint8ClampedArray, width: number, height: number, radius: number) {
  const scratch = new Uint8ClampedArray(data.length);
  for (let pass = 0; pass < 3; pass++) {
    boxBlurLines(data, scratch, width, height, radius, true);
    boxBlurLines(scratch, data, width, height, radius, false);
  }
}

/** Soft radial disc used as the thaw brush. Drawn with destination-out, so only alpha matters. */
function createBrushSprite(radius: number): HTMLCanvasElement {
  const size = Math.max(2, Math.ceil(radius * 2));
  const canvas = createSurface(size, size);
  const g = getContext(canvas);
  if (!g) return canvas;
  const r = size / 2;
  const gradient = g.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0, 'rgb(255 255 255 / 100%)');
  gradient.addColorStop(0.45, 'rgb(255 255 255 / 88%)');
  gradient.addColorStop(0.78, 'rgb(255 255 255 / 28%)');
  gradient.addColorStop(1, 'rgb(255 255 255 / 0%)');
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  return canvas;
}

/** Opaque at the edges, transparent in the middle. Used for refreezing from the edges inward. */
function createEdgeMask(width: number, height: number): HTMLCanvasElement {
  const canvas = createSurface(width, height);
  const g = getContext(canvas);
  if (!g) return canvas;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.hypot(cx, cy);
  const gradient = g.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius);
  gradient.addColorStop(0, 'rgb(0 0 0 / 0%)');
  gradient.addColorStop(1, 'rgb(0 0 0 / 100%)');
  g.fillStyle = gradient;
  g.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Alpha ramp for destination-in. The frost front moves from the outer edge toward the centre
 * as `progress` goes from 0 to 1, with a feathered band so the boundary never looks like a line.
 */
function coverageGradient(
  g: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
): CanvasGradient {
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.hypot(cx, cy);
  const feather = maxRadius * 0.22;
  const outer = maxRadius + feather;
  const eased = easeOutCubic(progress);
  const front = outer * (1 - eased) - feather * eased;
  const clearStop = clamp((front - feather / 2) / outer, 0, 1);
  const frozenStop = clamp((front + feather / 2) / outer, 0, 1);
  const gradient = g.createRadialGradient(cx, cy, 0, cx, cy, outer);
  gradient.addColorStop(0, 'rgb(0 0 0 / 0%)');
  gradient.addColorStop(clearStop, 'rgb(0 0 0 / 0%)');
  gradient.addColorStop(frozenStop, 'rgb(0 0 0 / 100%)');
  gradient.addColorStop(1, 'rgb(0 0 0 / 100%)');
  return gradient;
}

/** Parses an `object-position` value into 0–1 focal ratios. Lengths fall back to centre. */
function parseFocus(value: string): [number, number] {
  const tokens = value.trim().split(/\s+/);
  const ratio = (token: string | undefined) => {
    if (!token) return 0.5;
    if (token.endsWith('%')) return clamp(parseFloat(token) / 100, 0, 1);
    if (token === 'left' || token === 'top') return 0;
    if (token === 'right' || token === 'bottom') return 1;
    return 0.5;
  };
  return [ratio(tokens[0]), ratio(tokens[1])];
}

/**
 * Canvas frost with a thaw mask. The mask is a low-resolution alpha canvas that receives soft
 * brush stamps; the visible frost is erased where the mask is opaque. Only the thaw mask survives
 * while the surface is off screen, so long pages do not hold a full-size canvas per card.
 */
class FrostEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly frame: HTMLElement;
  private readonly interaction: HTMLElement;
  private readonly mode: FrostMode;
  private readonly profile: FrostProfile;
  private readonly onFirstThaw: () => void;
  private readonly seed: number;
  private readonly random: () => number;

  private thaw: HTMLCanvasElement = createSurface(1, 1);
  private thawCtx: CanvasRenderingContext2D | null = getContext(this.thaw);
  private thawHasContent = false;
  private firstThawNotified = false;
  private lastPoint: Point | null = null;

  private ctx: CanvasRenderingContext2D | null = null;
  private texture: HTMLCanvasElement | null = null;
  private blur: HTMLCanvasElement | null = null;
  private blurCtx: CanvasRenderingContext2D | null = null;
  private blurSource: HTMLImageElement | null = null;
  private brush: HTMLCanvasElement | null = null;
  private brushRadius = 0;
  private edgeMask: HTMLCanvasElement | null = null;
  private cssWidth = 0;
  private cssHeight = 0;

  private visible = false;
  private disposed = false;
  private loopId = 0;
  private lastFrameAt = 0;
  private visibleMs = 0;
  private progress = 0;
  private state: FrostState = 'clear';
  private dirty = false;
  private lastActivityAt = Number.NEGATIVE_INFINITY;

  private resizeTimer = 0;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(options: {
    canvas: HTMLCanvasElement;
    frame: HTMLElement;
    interaction: HTMLElement;
    mode: FrostMode;
    onFirstThaw: () => void;
  }) {
    this.canvas = options.canvas;
    this.frame = options.frame;
    this.interaction = options.interaction;
    this.mode = options.mode;
    this.profile = PROFILES[options.mode];
    this.onFirstThaw = options.onFirstThaw;
    instanceCounter += 1;
    this.seed = 0x9e3779b9 + instanceCounter * 7919;
    this.random = createRandom(this.seed);
  }

  start() {
    this.interaction.addEventListener('pointermove', this.handlePointerMove);
    this.interaction.addEventListener('pointerleave', this.endStroke);
    this.interaction.addEventListener('pointerup', this.endStroke);
    this.interaction.addEventListener('pointercancel', this.endStroke);
    for (const image of Array.from(this.frame.querySelectorAll('img'))) {
      image.addEventListener('load', this.wake);
    }

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.scheduleLayout());
      this.resizeObserver.observe(this.frame);
    }
    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        const latest = entries[entries.length - 1];
        this.setVisible(Boolean(latest?.isIntersecting));
      });
      this.intersectionObserver.observe(this.frame);
    } else {
      this.setVisible(true);
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.loopId);
    this.loopId = 0;
    window.clearTimeout(this.resizeTimer);
    this.interaction.removeEventListener('pointermove', this.handlePointerMove);
    this.interaction.removeEventListener('pointerleave', this.endStroke);
    this.interaction.removeEventListener('pointerup', this.endStroke);
    this.interaction.removeEventListener('pointercancel', this.endStroke);
    for (const image of Array.from(this.frame.querySelectorAll('img'))) {
      image.removeEventListener('load', this.wake);
    }
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.release();
  }

  private setVisible(visible: boolean) {
    if (this.disposed || visible === this.visible) return;
    this.visible = visible;
    if (visible) {
      this.layout();
      this.wake();
      return;
    }
    cancelAnimationFrame(this.loopId);
    this.loopId = 0;
    this.lastPoint = null;
    this.release();
  }

  private scheduleLayout() {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => {
      if (!this.visible || this.disposed) return;
      const rect = this.frame.getBoundingClientRect();
      if (Math.round(rect.width) === this.cssWidth && Math.round(rect.height) === this.cssHeight) {
        return;
      }
      this.layout();
    }, RESIZE_DEBOUNCE_MS);
  }

  /** Sizes every surface to the frame. Returns false while the frame has no layout box. */
  private layout(): boolean {
    const rect = this.frame.getBoundingClientRect();
    const cssWidth = Math.round(rect.width);
    const cssHeight = Math.round(rect.height);
    if (cssWidth < 8 || cssHeight < 8) return false;

    const { profile } = this;
    const dpr = window.devicePixelRatio || 1;
    const areaLimit = Math.sqrt(profile.maxPixels / (cssWidth * cssHeight));
    const scale = clamp(Math.min(dpr, profile.maxDpr, areaLimit), 0.5, profile.maxDpr);
    const width = Math.max(2, Math.round(cssWidth * scale));
    const height = Math.max(2, Math.round(cssHeight * scale));

    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = getContext(this.canvas);
    this.texture = buildFrostTexture(
      width,
      height,
      cssWidth,
      cssHeight,
      profile,
      this.mode,
      this.seed,
    );

    const blurWidth = Math.max(12, Math.round(width / profile.blurDivisor));
    const blurHeight = Math.max(8, Math.round((blurWidth * height) / width));
    this.blur = createSurface(blurWidth, blurHeight);
    this.blurCtx = getContext(this.blur);
    this.blurSource = null;

    this.resizeThaw(
      Math.max(8, Math.round(width * THAW_SCALE)),
      Math.max(8, Math.round(height * THAW_SCALE)),
    );
    const brushCss = clamp(
      Math.min(cssWidth, cssHeight) * profile.brushRatio,
      profile.brushMin,
      profile.brushMax,
    );
    this.brushRadius = brushCss * (this.thaw.width / cssWidth);
    this.brush = createBrushSprite(this.brushRadius);
    this.edgeMask = createEdgeMask(this.thaw.width, this.thaw.height);

    this.dirty = true;
    this.setState(this.state);
    const ready = Boolean(this.ctx && this.texture);
    if (ready) this.wake();
    return ready;
  }

  /** Changes the thaw mask size but keeps what was already scratched. */
  private resizeThaw(width: number, height: number) {
    if (this.thaw.width === width && this.thaw.height === height) return;
    const next = createSurface(width, height);
    const nextCtx = getContext(next);
    if (nextCtx && this.thawHasContent) {
      nextCtx.drawImage(this.thaw, 0, 0, next.width, next.height);
    }
    this.thaw = next;
    this.thawCtx = nextCtx;
  }

  /** Frees the large surfaces while the overlay is off screen. Frost progress is kept. */
  private release() {
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.ctx = null;
    this.texture = null;
    this.blur = null;
    this.blurCtx = null;
    this.blurSource = null;
    this.brush = null;
    this.edgeMask = null;
    this.dirty = false;
  }

  private setState(state: FrostState) {
    this.state = state;
    this.canvas.dataset.frostState = state;
  }

  private tick = (now: number) => {
    this.loopId = 0;
    this.advance(now);
    if (!this.isSettled()) this.loopId = requestAnimationFrame(this.tick);
  };

  /** Nothing left to animate: the frost is fully formed, nothing is refreezing and nothing is dirty. */
  private isSettled() {
    return (
      !this.ctx || !this.texture || (this.progress >= 1 && !this.thawHasContent && !this.dirty)
    );
  }

  /** Restarts the frame loop when something needs timing, drawing or a redraw. */
  private wake = () => {
    if (this.disposed || !this.visible || this.loopId) return;
    this.lastFrameAt = performance.now();
    this.loopId = requestAnimationFrame(this.tick);
  };

  private advance(now: number) {
    // Real elapsed time, capped so a long pause (backgrounded tab) cannot jump the timeline.
    const dt = clamp(now - this.lastFrameAt, 0, 250);
    this.lastFrameAt = now;
    if (!this.ctx || !this.texture) return;

    this.visibleMs += dt;
    let redraw = this.dirty;
    this.dirty = false;

    const progress = clamp((this.visibleMs - this.profile.clearMs) / this.profile.freezeMs, 0, 1);
    if (progress !== this.progress) {
      this.progress = progress;
      redraw = true;
      this.setState(progress >= 1 ? 'frozen' : progress > 0 ? 'freezing' : 'clear');
    }

    if (this.refreshBlur()) redraw = true;

    if (this.thawHasContent) {
      const idle = now - this.lastActivityAt;
      if (idle > REFREEZE_IDLE_MS) {
        if (idle < REFREEZE_IDLE_MS + REFREEZE_MS) {
          this.fadeThaw(dt);
        } else {
          this.clearThaw();
        }
        redraw = true;
      }
    }

    if (redraw && this.progress > 0) this.render();
  }

  /**
   * The blurred backdrop comes from the first decoded photo in the frame. Hero videos are served
   * cross-origin and cannot be read back, and a frozen still reads as the same scene anyway.
   */
  private pickSource(): HTMLImageElement | null {
    return (
      Array.from(this.frame.querySelectorAll('img')).find(
        (candidate) => candidate.complete && candidate.naturalWidth > 0,
      ) ?? null
    );
  }

  /** Redraws the blurred copy once per source. Returns true when it changed. */
  private refreshBlur(): boolean {
    const source = this.pickSource();
    if (!source || source === this.blurSource) return false;
    this.blurSource = source;
    this.drawBlur(source);
    return true;
  }

  /** Draws the photo with the same cover/focal mapping as the page, then blurs it in place. */
  private drawBlur(source: HTMLImageElement) {
    const ctx = this.blurCtx;
    const blur = this.blur;
    if (!ctx || !blur) return;
    const sourceWidth = source.naturalWidth;
    const sourceHeight = source.naturalHeight;
    if (!sourceWidth || !sourceHeight) return;

    const cover = Math.max(blur.width / sourceWidth, blur.height / sourceHeight);
    const drawWidth = sourceWidth * cover;
    const drawHeight = sourceHeight * cover;
    const [focusX, focusY] = parseFocus(getComputedStyle(source).objectPosition);

    ctx.clearRect(0, 0, blur.width, blur.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      source,
      (blur.width - drawWidth) * focusX,
      (blur.height - drawHeight) * focusY,
      drawWidth,
      drawHeight,
    );
    try {
      const pixels = ctx.getImageData(0, 0, blur.width, blur.height);
      boxBlurRGBA(pixels.data, blur.width, blur.height, this.profile.blurRadius);
      ctx.putImageData(pixels, 0, 0);
    } catch {
      // An unreadable source keeps the unblurred copy: still frosted, just sharper.
    }
  }

  private render() {
    const ctx = this.ctx;
    const texture = this.texture;
    if (!ctx || !texture) return;
    const { width, height } = this.canvas;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, width, height);

    if (this.blur) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(this.blur, 0, 0, width, height);
    } else {
      ctx.fillStyle = this.profile.base;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(texture, 0, 0, width, height);

    if (this.progress < 1) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = coverageGradient(ctx, width, height, this.progress);
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    }

    if (this.thawHasContent) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(this.thaw, 0, 0, width, height);
    }
    ctx.restore();
  }

  private toThawPoint(event: PointerEvent): Point | null {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    return {
      x: (x / rect.width) * this.thaw.width,
      y: (y / rect.height) * this.thaw.height,
    };
  }

  private handlePointerMove = (event: PointerEvent) => {
    if (!event.isPrimary || !this.visible || this.progress < MIN_THAW_PROGRESS) return;
    const point = this.toThawPoint(event);
    if (!point) {
      this.lastPoint = null;
      return;
    }
    this.lastActivityAt = performance.now();
    if (this.lastPoint) {
      this.strokeThaw(this.lastPoint, point);
    } else {
      this.stampThaw(point);
    }
    this.lastPoint = point;
    this.thawHasContent = true;
    this.dirty = true;
    this.wake();
    if (!this.firstThawNotified) {
      this.firstThawNotified = true;
      this.onFirstThaw();
    }
  };

  private endStroke = () => {
    this.lastPoint = null;
  };

  private strokeThaw(from: Point, to: Point) {
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const step = Math.max(1, this.brushRadius * 0.22);
    const steps = clamp(Math.ceil(distance / step), 1, 60);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      this.stampThaw({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
    }
  }

  /** One brush dab: a soft core, two offset passes for an uneven edge, and the odd melt droplet. */
  private stampThaw(point: Point) {
    const ctx = this.thawCtx;
    const brush = this.brush;
    if (!ctx || !brush) return;
    const r = this.brushRadius;
    ctx.save();
    ctx.globalAlpha = 0.72 + this.random() * 0.28;
    ctx.drawImage(brush, point.x - r, point.y - r, r * 2, r * 2);
    for (let i = 0; i < 2; i++) {
      const angle = this.random() * Math.PI * 2;
      const offset = r * (0.35 + this.random() * 0.45);
      const size = r * (0.4 + this.random() * 0.35);
      ctx.globalAlpha = 0.5 + this.random() * 0.3;
      ctx.drawImage(
        brush,
        point.x + Math.cos(angle) * offset - size,
        point.y + Math.sin(angle) * offset - size,
        size * 2,
        size * 2,
      );
    }
    if (this.random() < 0.4) {
      const angle = this.random() * Math.PI * 2;
      const offset = r * (1.05 + this.random() * 0.45);
      const size = r * (0.12 + this.random() * 0.12);
      ctx.globalAlpha = 0.85;
      ctx.drawImage(
        brush,
        point.x + Math.cos(angle) * offset - size,
        point.y + Math.sin(angle) * offset - size,
        size * 2,
        size * 2,
      );
    }
    ctx.restore();
  }

  private fadeThaw(dt: number) {
    const ctx = this.thawCtx;
    if (!ctx) return;
    const share = dt / REFREEZE_MS;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = clamp(share * 5, 0, 1);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.thaw.width, this.thaw.height);
    if (this.edgeMask) {
      ctx.globalAlpha = clamp(share * 4, 0, 1);
      ctx.drawImage(this.edgeMask, 0, 0, this.thaw.width, this.thaw.height);
    }
    ctx.restore();
  }

  private clearThaw() {
    this.thawCtx?.clearRect(0, 0, this.thaw.width, this.thaw.height);
    this.thawHasContent = false;
    this.lastPoint = null;
  }
}

/**
 * Glacial-only frost layer. Renders nothing for other eras and when the visitor prefers reduced
 * motion, so the surrounding photo is shown as-is.
 */
export function FrostScratchOverlay({
  mode,
  interactionRef,
  onFirstThaw,
}: FrostScratchOverlayProps) {
  const { currentTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  if (currentTheme !== 'glacial' || reducedMotion) return null;
  return <FrostCanvas mode={mode} interactionRef={interactionRef} onFirstThaw={onFirstThaw} />;
}

function FrostCanvas({ mode, interactionRef, onFirstThaw }: FrostScratchOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firstThawRef = useRef(onFirstThaw);

  useEffect(() => {
    firstThawRef.current = onFirstThaw;
  }, [onFirstThaw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = canvas?.parentElement;
    if (!canvas || !frame) return;
    const engine = new FrostEngine({
      canvas,
      frame,
      interaction: interactionRef?.current ?? frame,
      mode,
      onFirstThaw: () => firstThawRef.current?.(),
    });
    engine.start();
    return () => engine.dispose();
  }, [mode, interactionRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`frost-scratch frost-scratch--${mode}`}
      aria-hidden="true"
      data-frost-mode={mode}
      data-frost-state="clear"
    />
  );
}
