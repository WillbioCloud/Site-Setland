import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Hero } from '../components/Hero';
import { Eras } from '../components/Eras';
import { Attractions } from '../components/Attractions';
import { MenuHighlights } from '../components/MenuHighlights';
import { VisitInfo } from '../components/VisitInfo';
import { FAQ } from '../components/FAQ';
import '../styles/interactive-map.css';

const InteractiveMapSection = lazy(() =>
  import('../components/InteractiveMapSection').then((module) => ({
    default: module.InteractiveMapSection,
  })),
);

function DeferredInteractiveMapSection() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder) return;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '260px 0px' },
    );
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={placeholderRef}
      id={shouldLoad ? undefined : 'localizacao'}
      className="interactive-map-deferred"
    >
      {shouldLoad ? (
        <Suspense
          fallback={
            <div className="interactive-map-loading" role="status">
              <span>Preparando a carta de localização…</span>
            </div>
          }
        >
          <InteractiveMapSection />
        </Suspense>
      ) : (
        <div className="interactive-map-loading" aria-hidden="true">
          <span>Trace sua jornada</span>
        </div>
      )}
    </div>
  );
}

export function Home({ onOpenTickets }: { onOpenTickets: () => void }) {
  return (
    <>
      <Hero onOpenTickets={onOpenTickets} />
      <Eras onOpenTickets={onOpenTickets} />
      <Attractions onOpenTickets={onOpenTickets} />
      <MenuHighlights />
      <VisitInfo onOpenTickets={onOpenTickets} />
      <DeferredInteractiveMapSection />
      <FAQ />
    </>
  );
}
