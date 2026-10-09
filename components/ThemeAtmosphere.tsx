import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

type AtmosphereKind = 'snow' | 'embers';

interface Particle {
  /** Horizontal anchor; the drift is added around it. */
  anchorX: number;
  y: number;
  radius: number;
  /** Vertical speed in px/s. Snow falls, embers rise. */
  speed: number;
  drift: number;
  phase: number;
  sway: number;
  alpha: number;
}

const SNOW_COLOR = '224, 242, 254';
const EMBER_COLOR = '255, 196, 92';
const EMBER_CORE = '255, 226, 160';
const FRAME_INTERVAL_MS = 1000 / 30;
const RESIZE_DEBOUNCE_MS = 150;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const particleCount = (kind: AtmosphereKind, width: number, height: number) => {
  const area = width * height;
  return kind === 'snow'
    ? clamp(Math.round(area / 16000), 28, 90)
    : clamp(Math.round(area / 30000), 18, 48);
};

function createParticle(kind: AtmosphereKind, width: number, height: number, scatter: boolean) {
  const snow = kind === 'snow';
  return {
    anchorX: Math.random() * width,
    y: scatter ? Math.random() * height : snow ? -12 : height + 12,
    radius: snow ? 0.8 + Math.random() * 2 : 0.9 + Math.random() * 1.8,
    speed: snow ? 14 + Math.random() * 26 : 26 + Math.random() * 46,
    drift: snow ? 8 + Math.random() * 14 : 4 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2,
    sway: snow ? 0.4 + Math.random() * 0.8 : 1 + Math.random() * 2.2,
    alpha: snow ? 0.3 + Math.random() * 0.6 : 0.5 + Math.random() * 0.5,
  } satisfies Particle;
}

/**
 * Full-viewport decoration for the Glacial (snow) and Medieval (embers) atmospheres.
 * It renders nothing under reduced motion, pauses while the tab is hidden, and draws at 30 fps.
 */
export function ThemeAtmosphere() {
  const { currentTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;
  if (currentTheme === 'glacial') return <AtmosphereCanvas kind="snow" />;
  if (currentTheme === 'medieval') return <AtmosphereCanvas kind="embers" />;
  return null;
}

function AtmosphereCanvas({ kind }: { kind: AtmosphereKind }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId = 0;
    let resizeTimer = 0;
    let lastTime = 0;
    let lastDraw = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = particleCount(kind, width, height);
      particles = Array.from({ length: count }, () => createParticle(kind, width, height, true));
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, RESIZE_DEBOUNCE_MS);
    };

    const step = (dt: number) => {
      const snow = kind === 'snow';
      for (const particle of particles) {
        particle.phase += particle.sway * dt;
        particle.y += (snow ? particle.speed : -particle.speed) * dt;
        if (snow && particle.y > height + 12) {
          Object.assign(particle, createParticle(kind, width, height, false));
        } else if (!snow && particle.y < -12) {
          Object.assign(particle, createParticle(kind, width, height, false));
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (kind === 'snow') {
        for (const particle of particles) {
          const x = particle.anchorX + Math.sin(particle.phase) * particle.drift;
          ctx.globalAlpha = particle.alpha;
          ctx.fillStyle = `rgb(${SNOW_COLOR})`;
          ctx.beginPath();
          ctx.arc(x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.globalCompositeOperation = 'lighter';
        for (const particle of particles) {
          const x = particle.anchorX + Math.sin(particle.phase) * particle.drift * 0.6;
          // Embers flicker and cool as they rise.
          const life = clamp(particle.y / height, 0, 1);
          const flicker = 0.55 + 0.45 * Math.sin(particle.phase * 2.7);
          const alpha = particle.alpha * flicker * (0.25 + 0.75 * life ** 0.6);
          ctx.globalAlpha = alpha * 0.22;
          ctx.fillStyle = `rgb(${EMBER_COLOR})`;
          ctx.beginPath();
          ctx.arc(x, particle.y, particle.radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${EMBER_CORE})`;
          ctx.beginPath();
          ctx.arc(x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick);
      const dt = lastTime ? clamp((now - lastTime) / 1000, 0, 0.05) : 0;
      lastTime = now;
      if (document.hidden) return;
      step(dt);
      if (now - lastDraw >= FRAME_INTERVAL_MS) {
        lastDraw = now;
        draw();
      }
    };

    resize();
    window.addEventListener('resize', handleResize);
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [kind]);

  return (
    <canvas
      ref={canvasRef}
      className={`theme-atmosphere theme-atmosphere--${kind}`}
      aria-hidden="true"
    />
  );
}
