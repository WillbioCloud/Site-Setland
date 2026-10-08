import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Compass, MapPin, Sparkles } from 'lucide-react';
import parchmentImage from '../assets/old-map-parchment.webp';
import { MAP_URL } from '../data/park';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { SceneMotion } from './InteractiveMapCanvas';

const MapCanvas = lazy(() =>
  import('./InteractiveMapCanvas').then((module) => ({
    default: module.InteractiveMapCanvas,
  })),
);
const MAP_EMBED_URL =
  'https://maps.google.com/?q=Setland+Parque+Tematico+Caldas+Novas+GO&output=embed';
const MODEL_CREDIT_URL =
  'https://sketchfab.com/3d-models/old-map-3d-model-c8f056e093f74be99b2e83034099c40a';
const MODEL_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';

export function InteractiveMapSection() {
  const reducedMotion = useReducedMotion();
  const [webglFailed, setWebglFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [mapMounted, setMapMounted] = useState(false);
  const mapWindowRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hasAutoOpenedRef = useRef(false);
  const sceneMotion = useRef<SceneMotion>({ progress: 0, tiltX: 0, tiltY: 0 });
  const isFallback = reducedMotion || webglFailed;
  const isOpen = isFallback || isPinned || isHovered;

  const handleWebglFailure = useCallback(() => setWebglFailed(true), []);

  useEffect(() => {
    const mapWindow = mapWindowRef.current;
    if (isFallback) {
      setMapMounted(true);
      if (mapWindow) gsap.set(mapWindow, { autoAlpha: 1, scale: 1, y: 0 });
      return;
    }
    if (!mapWindow) return;

    const timeline = gsap.timeline({
      onComplete: () => {
        if (!isOpen) setMapMounted(false);
      },
    });

    if (isOpen) {
      setMapMounted(true);
      timeline.to(sceneMotion.current, { progress: 1, duration: 1.48, ease: 'power3.inOut' }, 0);
      timeline.to(
        mapWindow,
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.68, ease: 'back.out(1.18)' },
        0.78,
      );
    } else {
      timeline.to(
        mapWindow,
        { autoAlpha: 0, scale: 0.96, y: 12, duration: 0.45, ease: 'power2.inOut' },
        0,
      );
      timeline.to(sceneMotion.current, { progress: 0, duration: 1.16, ease: 'power3.inOut' }, 0.16);
      timeline.call(() => setMapMounted(false), [], 1.36);
    }

    return () => {
      timeline.kill();
    };
  }, [isFallback, isOpen]);

  // Touch devices have no hover reveal: open the parchment automatically the
  // first time it scrolls into view, and let the visitor release it afterwards.
  useEffect(() => {
    if (isFallback) return;
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === 'undefined') return;
    const isTouchDevice =
      window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches;
    if (!isTouchDevice) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasAutoOpenedRef.current) return;
        hasAutoOpenedRef.current = true;
        setIsPinned(true);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, [isFallback]);

  const updateTilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const stage = event.currentTarget.querySelector('.interactive-map__stage');
    if (!stage || !stage.contains(event.target as Node)) {
      sceneMotion.current.tiltX = 0;
      sceneMotion.current.tiltY = 0;
      return;
    }
    const bounds = stage.getBoundingClientRect();
    sceneMotion.current.tiltX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    sceneMotion.current.tiltY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || isFallback) return;
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    sceneMotion.current.tiltX = 0;
    sceneMotion.current.tiltY = 0;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' || isFallback) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, a, iframe')) return;
    setIsPinned(true);
  };

  const handleTogglePin = () => {
    if (isFallback) return;
    setIsPinned((pinned) => !pinned);
  };

  const mapWindow = (
    <div
      id="interactive-map-window"
      ref={mapWindowRef}
      className={`interactive-map__window ${isFallback ? 'interactive-map__window--fallback' : ''}`}
      aria-hidden={!isOpen}
    >
      <div className="interactive-map__window-bar">
        <span>
          <MapPin size={13} aria-hidden="true" /> ROTA ATÉ O SETLAND PARK
        </span>
        <a href={MAP_URL} target="_blank" rel="noreferrer" tabIndex={isOpen ? 0 : -1}>
          Abrir no Maps <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
      {isFallback || mapMounted ? (
        <iframe
          title="Mapa do Setland Park em Caldas Novas, Goiás"
          src={MAP_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          tabIndex={isOpen ? 0 : -1}
        />
      ) : (
        <div className="interactive-map__window-loading" aria-hidden="true">
          <Compass size={25} strokeWidth={1.2} />
          <span>A carta está sendo revelada…</span>
        </div>
      )}
    </div>
  );

  return (
    <section id="localizacao" className="section interactive-map-section">
      <div className="container interactive-map__layout">
        <div className="interactive-map__copy">
          <span className="eyebrow">
            <span className="eyebrow-line" /> Trace sua jornada
          </span>
          <h2>
            Toda grande
            <br />
            aventura tem
            <br />
            <span className="text-gold">um caminho.</span>
          </h2>
          <p>
            Caldas Novas, Goiás. Revele a carta e encontre a rota até o Setland Park — seu próximo
            capítulo começa aqui.
          </p>

          <div className="interactive-map__destination">
            <span className="interactive-map__destination-icon">
              <MapPin size={17} aria-hidden="true" />
            </span>
            <span>
              <strong>Setland Park</strong>
              <small>Caldas Novas · Goiás · Brasil</small>
            </span>
          </div>

          <a
            className="interactive-map__directions"
            href={MAP_URL}
            target="_blank"
            rel="noreferrer"
          >
            Planejar minha rota <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div
          className="interactive-map__artifact"
          onPointerEnter={handlePointerEnter}
          onPointerMove={updateTilt}
          onPointerLeave={handlePointerLeave}
          onPointerUp={handlePointerUp}
        >
          <div
            ref={stageRef}
            className={`interactive-map__stage ${isFallback ? 'interactive-map__stage--fallback' : ''} ${isOpen ? 'interactive-map__stage--open' : ''}`}
            role="group"
            aria-label="Pergaminho interativo com a localização do Setland Park"
          >
            {isFallback ? (
              <div
                className="interactive-map__parchment"
                aria-hidden="true"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgb(37 25 12 / 13%), rgb(31 20 10 / 44%)), url("${parchmentImage}")`,
                }}
              />
            ) : (
              <Suspense
                fallback={<div className="interactive-map__scene-loading" aria-hidden="true" />}
              >
                <MapCanvas motion={sceneMotion} onFailure={handleWebglFailure} />
              </Suspense>
            )}

            <div className="interactive-map__stamp" aria-hidden="true">
              <span className="interactive-map__status-dot" />
              {isOpen ? 'CARTA REVELADA' : 'CARTA SELADA'}
            </div>

            {!isFallback && (
              <div className="interactive-map__prompt" aria-hidden="true">
                <Sparkles size={13} />
                <span>Toque para revelar</span>
              </div>
            )}

            {mapWindow}
          </div>

          <div className="interactive-map__stage-footer">
            {isFallback ? (
              <a
                className="interactive-map__reveal"
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Compass size={16} aria-hidden="true" /> Abrir rotas no Google Maps
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ) : (
              <button
                type="button"
                className="interactive-map__reveal"
                onClick={handleTogglePin}
                aria-expanded={isOpen}
                aria-controls="interactive-map-window"
              >
                <Compass size={16} aria-hidden="true" />
                {isPinned
                  ? 'Soltar o pergaminho'
                  : isOpen
                    ? 'Manter o mapa aberto'
                    : 'Desenrolar pergaminho'}
              </button>
            )}
            <div className="interactive-map__credits">
              <a
                className="interactive-map__credit"
                href={MODEL_CREDIT_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Modelo 3D Old Map, de Johana-PS"
              >
                Modelo 3D: Old Map · Johana-PS
              </a>
              <span aria-hidden="true">·</span>
              <a
                className="interactive-map__credit"
                href={MODEL_LICENSE_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Licença Creative Commons Atribuição 4.0"
              >
                CC BY 4.0
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
