import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  Users,
} from 'lucide-react';
import { MAP_URL } from '../data/park';
import { TICKET_PRICES, formatCurrency } from '../data/visit';
import { Button } from './Button';

export function VisitInfo({ onOpenTickets }: { onOpenTickets: () => void }) {
  return (
    <section id="visita" className="section visit-section">
      <div className="container visit-grid">
        <div className="visit-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" /> O próximo capítulo é seu
          </span>
          <h2>
            Só falta você
            <br />
            <span className="text-gold">nessa história.</span>
          </h2>
          <p>
            Um dia diferente começa com um bom plano. Confira as informações e prepare-se para viver
            o Setland.
          </p>
          <Button onClick={onOpenTickets}>
            <CalendarDays size={17} aria-hidden="true" /> Planejar minha visita{' '}
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
          <span className="visit-copy__note">Escolha uma data e simule seus ingressos.</span>
        </div>
        <div className="visit-cards">
          <article className="premium-card visit-card">
            <Clock3 size={23} strokeWidth={1.4} aria-hidden="true" />
            <h3>Tempo de aventura</h3>
            <strong>Terça a domingo</strong>
            <p>Das 9h às 18h</p>
            <span className="small-note">Confirme a programação de feriados.</span>
          </article>
          <article className="premium-card visit-card">
            <MapPin size={23} strokeWidth={1.4} aria-hidden="true" />
            <h3>Seu próximo destino</h3>
            <strong>Caldas Novas, GO</strong>
            <p>No coração de Goiás.</p>
            <a href={MAP_URL} target="_blank" rel="noreferrer" className="text-link">
              Como chegar <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </article>
          <article className="premium-card visit-card">
            <Ticket size={23} strokeWidth={1.4} aria-hidden="true" />
            <h3>Passaporte para a diversão</h3>
            <strong>
              {formatCurrency(TICKET_PRICES.adult)} <span>/ inteira</span>
            </strong>
            <p>Infantil e sênior: {formatCurrency(TICKET_PRICES.child)}</p>
            <button className="text-link" onClick={onOpenTickets}>
              Ver ingressos <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          </article>
          <article className="premium-card visit-card">
            <Users size={23} strokeWidth={1.4} aria-hidden="true" />
            <h3>Juntos é ainda melhor</h3>
            <strong>Uma visita em família</strong>
            <p>Crianças de até 5 anos não pagam.</p>
            <span className="small-note">Leve documento de identificação.</span>
          </article>
        </div>
      </div>
    </section>
  );
}
