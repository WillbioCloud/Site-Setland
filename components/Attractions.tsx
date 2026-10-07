import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Ticket } from 'lucide-react';
import { attractions, eras, type ParkAttraction } from '../data/park';
import type { Attraction } from '../types';
import { Button } from './Button';
import { Modal } from './Modal';

type Filter = 'all' | Attraction['category'];
const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todas as experiências' },
  { id: 'scenery', label: 'Cenários & descobertas' },
  { id: 'radical', label: 'Aventura & emoção' },
  { id: 'kids', label: 'Para os pequenos' },
];

export function Attractions({ onOpenTickets }: { onOpenTickets: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<ParkAttraction | null>(null);
  const filtered = attractions.filter(
    (attraction) => filter === 'all' || attraction.category === filter,
  );

  return (
    <section id="atracoes" className="section attractions-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-line" /> Viva cada descoberta
            </span>
            <h2>
              Fora da rotina.
              <br />
              <span className="text-gold">Dentro da sua memória.</span>
            </h2>
          </div>
          <p>
            Aventuras para os corajosos. Encantos para os pequenos.
            <br className="desktop-break" /> E momentos para todo mundo levar para casa.
          </p>
        </div>
        <div className="attraction-toolbar">
          <div className="filter-list" role="group" aria-label="Filtrar atrações">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                className={`filter-chip ${filter === id ? 'is-active' : ''}`}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="result-count" role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'experiência' : 'experiências'}
          </span>
        </div>
        <div className="attraction-grid">
          {filtered.map((attraction) => (
            <article className="attraction-card premium-card" key={attraction.id}>
              <button
                className="attraction-card__button"
                onClick={() => setSelected(attraction)}
                aria-label={`Conhecer ${attraction.name}`}
              >
                <div className="attraction-card__image">
                  <img
                    src={attraction.imageUrl}
                    alt={attraction.name}
                    width="640"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    className={`photo-badge ${attraction.era === 'glacial' ? 'photo-badge--ice' : ''}`}
                  >
                    {attraction.badge}
                  </span>
                </div>
                <div className="attraction-card__body">
                  <span className="eyebrow">
                    {eras.find((era) => era.id === attraction.era)?.name}
                  </span>
                  <div className="attraction-card__title">
                    <h3>{attraction.name}</h3>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </div>
                  <p>{attraction.description}</p>
                  <span className="attraction-card__link">
                    Conhecer experiência <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
      <Modal
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        titleId="attraction-title"
        className="attraction-modal"
      >
        {selected && (
          <>
            <div className="detail-modal__hero">
              <img src={selected.imageUrl} alt={selected.name} />
              <div className="detail-modal__hero-shade" />
              <div>
                <span className="photo-badge">{selected.badge}</span>
                <h2 id="attraction-title">{selected.name}</h2>
              </div>
            </div>
            <div className="attraction-modal__body">
              <span className="eyebrow">{eras.find((era) => era.id === selected.era)?.name}</span>
              <p>{selected.detail}</p>
              <Button
                onClick={() => {
                  setSelected(null);
                  onOpenTickets();
                }}
              >
                <Ticket size={17} aria-hidden="true" /> Incluir na minha aventura{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
