import type { ButtonHTMLAttributes } from 'react';
import { ArrowRight, Ticket } from 'lucide-react';

export interface TicketCtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function TicketCtaButton({
  onClick,
  className = '',
  label = 'Garanta seu ingresso',
  ...rest
}: TicketCtaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ticket-cta-button ${className}`.trim()}
      aria-label={label}
      {...rest}
    >
      <span className="ticket-cta-stub" aria-hidden="true">
        <Ticket size={18} strokeWidth={2} />
      </span>
      <span className="ticket-cta-divider" aria-hidden="true" />
      <span className="ticket-cta-content">
        <span className="ticket-cta-label">{label}</span>
        <ArrowRight size={18} strokeWidth={2} className="ticket-cta-arrow" aria-hidden="true" />
      </span>
      <span className="ticket-cta-sheen" aria-hidden="true" />
    </button>
  );
}
