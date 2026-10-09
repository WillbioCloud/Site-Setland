import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Ticket } from 'lucide-react';
import { eras } from '../data/park';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';
import { FrostScratchOverlay } from './FrostScratchOverlay';
import { Modal } from './Modal';

export function Eras({ onOpenTickets }: { onOpenTickets: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { setTheme } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const era = selected === null ? null : eras[selected];

  const explore = (index: number) => {
    setSelected(index);
    setTheme(eras[index].id);
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section id="eras" className="section eras-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-line" /> Três eras. Infinitas possibilidades.
            </span>
            <h2>
              O tempo muda.
              <br />
              <span className="text-gold">A aventura fica.</span>
            </h2>
          </div>
          <p>
            Do frio que surpreende às histórias que encantam.
            <br className="desktop-break" /> Atravesse três universos e encontre o seu jeito de
            viver o extraordinário.
          </p>
        </div>
        <div className="era-grid">
          {eras.map(
            ({ id, number, name, image, imageAlt, icon: Icon, tagline, summary }, index) => (
              <button
                key={id}
                className="era-card"
                data-era={id}
                onClick={() => explore(index)}
                aria-label={`Explorar ${name}`}
              >
                <img
                  src={image}
                  alt={imageAlt}
                  width="640"
                  height="480"
                  loading="lazy"
                  decoding="async"
                />
                <FrostScratchOverlay mode="card" />
                <div className="era-card__shade" />
                <div className="era-card__top">
                  <span>
                    {number} <span className="era-card__slash">/</span> TRÊS ERAS
                  </span>
                  <Icon size={25} strokeWidth={1.15} aria-hidden="true" />
                </div>
                <div className="era-card__content">
                  <span className="era-card__tagline">{tagline}</span>
                  <div className="era-card__title">
                    <h3>{name}</h3>
                    <span className="circle-arrow">
                      <ArrowUpRight size={19} aria-hidden="true" />
                    </span>
                  </div>
                  <p>{summary}</p>
                </div>
              </button>
            ),
          )}
        </div>
        <div className="section-note">
          <span className="tiny-diamond" /> Escolha uma era. Descubra um novo mundo.{' '}
          <span className="tiny-diamond" />
        </div>
      </div>
      <Modal
        isOpen={era !== null}
        onClose={() => setSelected(null)}
        titleId="era-title"
        className="era-modal"
      >
        {era && (
          <div ref={contentRef} className="detail-modal__scroll">
            <div className="detail-modal__hero">
              <img src={era.image} alt={era.imageAlt} />
              <div className="detail-modal__hero-shade" />
              <div>
                <span className="eyebrow">{era.tagline}</span>
                <h2 id="era-title">{era.name}</h2>
                <span className="photo-badge">{era.badge}</span>
              </div>
            </div>
            <div className="detail-modal__body">
              <div className="detail-modal__main">
                <p className="detail-modal__description">{era.description}</p>
                <h3>Um pouco do que espera por você</h3>
                <div className="era-gallery">
                  {era.gallery.map((photo) => (
                    <figure key={photo.src}>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        width="320"
                        height="240"
                      />
                      <figcaption>{photo.alt}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <aside className="detail-modal__aside premium-card">
                <span className="eyebrow">A sua próxima parada</span>
                <h3>Viva essa experiência</h3>
                <ul>
                  {era.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="small-note">
                  Consulte a programação e as condições de acesso com a equipe do parque.
                </p>
                <Button
                  fullWidth
                  onClick={() => {
                    setSelected(null);
                    onOpenTickets();
                  }}
                >
                  <Ticket size={16} aria-hidden="true" /> Planejar visita
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => explore(((selected ?? 0) + 1) % eras.length)}
                >
                  Explorar próxima era <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </aside>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
