import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Castle,
  Check,
  CheckCircle2,
  CreditCard,
  Info,
  LoaderCircle,
  Minus,
  Plus,
  Ticket,
  Wallet,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CASTLE_IMAGE, INSTAGRAM_URL } from '../data/park';
import {
  calculateTicketTotal,
  formatCurrency,
  localDateISO,
  TICKET_PRICES,
  validVisitDate,
} from '../data/visit';
import { cpfDigits, formatCPF, formatPhone, isValidCPF } from '../data/checkout';
import { Button } from './Button';
import { Modal } from './Modal';

export interface CheckoutData {
  theme: string;
  visitDate: string;
  tickets: { adult: number; child: number; senior: number };
  customer: { name: string; email: string; cpf: string; phone: string };
  totalAmount: number;
  paymentMethod: 'pix' | 'credit_card';
}
interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: (data: CheckoutData) => Promise<void>;
}
type TicketType = keyof typeof TICKET_PRICES;
const ticketLabels: { id: TicketType; label: string; detail: string }[] = [
  { id: 'adult', label: 'Adulto', detail: 'Entrada inteira' },
  { id: 'child', label: 'Infantil', detail: 'De 6 a 12 anos' },
  { id: 'senior', label: 'Sênior', detail: 'A partir de 60 anos' },
];
const emptyCustomer = { name: '', email: '', cpf: '', phone: '' };

export function TicketModal({ isOpen, onClose, onCheckout }: TicketModalProps) {
  const { currentTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [tickets, setTickets] = useState({ adult: 1, child: 0, senior: 0 });
  const [customer, setCustomer] = useState(emptyCustomer);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const requestVersion = useRef(0);
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const stepScroll = useRef<HTMLDivElement>(null);
  const isDemo = !onCheckout;
  const count = tickets.adult + tickets.child + tickets.senior;
  const total = calculateTicketTotal(tickets);
  const formattedDate =
    date && !Number.isNaN(new Date(`${date}T12:00:00`).getTime())
      ? new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Escolha sua data';

  useEffect(() => {
    requestVersion.current++;
    setStep(1);
    setDate('');
    setTickets({ adult: 1, child: 0, senior: 0 });
    setCustomer(emptyCustomer);
    setPaymentMethod('pix');
    setProcessing(false);
    setError('');
  }, [isOpen]);

  useEffect(() => {
    if (step > 1) stepTitle.current?.focus({ preventScroll: true });
    stepScroll.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  const nextFromVisit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validVisitDate(date)) {
      setError(
        new Date(`${date}T12:00:00`).getDay() === 1
          ? 'O parque funciona de terça a domingo. Escolha outro dia para sua visita.'
          : 'Escolha uma data válida a partir de hoje.',
      );
      return;
    }
    if (count === 0) {
      setError('Selecione pelo menos um ingresso.');
      return;
    }
    setError('');
    setStep(2);
  };

  const nextFromCustomer = (event: React.FormEvent) => {
    event.preventDefault();
    if (customer.name.trim().split(/\s+/).length < 2) {
      setError('Informe seu nome e sobrenome.');
      return;
    }
    if ((customer.cpf || !isDemo) && !isValidCPF(customer.cpf)) {
      setError('Confira o CPF informado. Ele deve conter 11 dígitos válidos.');
      return;
    }
    const phone = customer.phone.replace(/\D/g, '');
    if ((phone || !isDemo) && ![10, 11].includes(phone.length)) {
      setError('Informe um telefone válido, incluindo o DDD.');
      return;
    }
    setError('');
    setStep(3);
  };

  const confirm = async () => {
    if (processing) return;
    setError('');
    if (!onCheckout) {
      setStep(4);
      return;
    }
    const version = requestVersion.current;
    setProcessing(true);
    try {
      await onCheckout({
        theme: currentTheme,
        visitDate: date,
        tickets: { ...tickets },
        customer: {
          ...customer,
          name: customer.name.trim(),
          email: customer.email.trim(),
          cpf: cpfDigits(customer.cpf),
          phone: customer.phone.replace(/\D/g, ''),
        },
        totalAmount: total,
        paymentMethod,
      });
      if (requestVersion.current === version) setStep(4);
    } catch {
      if (requestVersion.current === version)
        setError(
          'Não recebemos a confirmação do pedido. Verifique com a equipe antes de tentar novamente.',
        );
    } finally {
      if (requestVersion.current === version) setProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="ticket-title"
      className="ticket-modal"
      closeLabel="Fechar planejador de ingressos"
    >
      <div className="ticket-layout">
        <aside className="ticket-summary">
          <img className="ticket-summary__image" src={CASTLE_IMAGE} alt="" />
          <div className="ticket-summary__shade" />
          <div className="ticket-summary__intro">
            <div className="ticket-summary__brand">
              <Castle size={22} strokeWidth={1.3} aria-hidden="true" /> SETLAND
            </div>
            <span className="eyebrow">Seu próximo capítulo</span>
            <h3>
              Boas histórias
              <br />
              começam aqui.
            </h3>
            <p>
              Um destino. Três eras.
              <br />
              Um dia para guardar na memória.
            </p>
          </div>
          <div className="ticket-summary__details">
            <div>
              <CalendarDays size={16} aria-hidden="true" />
              <span>{formattedDate}</span>
            </div>
            <div>
              <Ticket size={16} aria-hidden="true" />
              <span>
                {count} {count === 1 ? 'ingresso selecionado' : 'ingressos selecionados'}
              </span>
            </div>
            <div className="ticket-summary__total">
              <span>{isDemo ? 'Total estimado' : 'Total'}</span>
              <strong aria-live="polite">{formatCurrency(total)}</strong>
            </div>
            <p>
              {isDemo
                ? 'Simulação sem cobrança ou reserva.'
                : 'Confira todos os dados antes de confirmar.'}
            </p>
          </div>
        </aside>
        <div className="ticket-content" ref={stepScroll}>
          <span className="eyebrow">
            {isDemo ? 'Planejador de ingressos' : 'Sua visita ao Setland'}
          </span>
          <h2 id="ticket-title">
            {step === 4 ? 'Até a próxima aventura.' : 'Planeje sua visita.'}
          </h2>
          <ol className="checkout-steps" aria-label="Etapas do planejamento">
            {['Sua visita', 'Seus dados', 'Revisão'].map((label, index) => (
              <li
                className={
                  step === index + 1 ? 'is-current' : step > index + 1 ? 'is-complete' : ''
                }
                key={label}
                aria-current={step === index + 1 ? 'step' : undefined}
              >
                <span>{step > index + 1 ? <Check size={13} aria-hidden="true" /> : index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          {isDemo && step !== 4 && (
            <div className="checkout-demo">
              <Info size={17} aria-hidden="true" />
              <p>
                Você está em uma <strong>simulação</strong>. Não há cobrança ou emissão de
                ingressos. Confirme sua compra com a equipe.
              </p>
            </div>
          )}
          {step < 4 && (
            <div className="ticket-mobile-total">
              <span>
                {count} {count === 1 ? 'ingresso' : 'ingressos'} ·{' '}
                {isDemo ? 'Total estimado' : 'Total'}
              </span>
              <strong aria-live="polite">{formatCurrency(total)}</strong>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={nextFromVisit} className="checkout-form">
              <h3 ref={stepTitle} tabIndex={-1}>
                Quando vamos viver essa história?
              </h3>
              <div className="form-field">
                <label htmlFor="visit-date">Data da visita</label>
                <input
                  id="visit-date"
                  type="date"
                  required
                  min={localDateISO()}
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setError('');
                  }}
                  aria-describedby="visit-date-hint"
                />
                <span id="visit-date-hint" className="form-hint">
                  Terça a domingo, das 9h às 18h.
                </span>
              </div>
              <fieldset className="ticket-counters">
                <legend>Quem vem com você?</legend>
                {ticketLabels.map(({ id, label, detail }) => (
                  <div className="ticket-counter" key={id}>
                    <div>
                      <span className="ticket-counter__name">
                        {label}
                        <small>{detail}</small>
                      </span>
                      <span className="ticket-counter__price">
                        {formatCurrency(TICKET_PRICES[id])}
                      </span>
                    </div>
                    <div className="counter-controls">
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Remover ingresso ${label.toLowerCase()}`}
                        disabled={tickets[id] === 0}
                        onClick={() =>
                          setTickets((previous) => ({
                            ...previous,
                            [id]: Math.max(0, previous[id] - 1),
                          }))
                        }
                      >
                        <Minus size={15} aria-hidden="true" />
                      </button>
                      <output aria-label={`Quantidade ${label.toLowerCase()}`}>
                        {tickets[id]}
                      </output>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Adicionar ingresso ${label.toLowerCase()}`}
                        disabled={tickets[id] >= 20}
                        onClick={() =>
                          setTickets((previous) => ({
                            ...previous,
                            [id]: Math.min(20, previous[id] + 1),
                          }))
                        }
                      >
                        <Plus size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </fieldset>
              <p className="form-hint">
                Crianças de até 5 anos não pagam. Apresente documento de identificação.
              </p>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" fullWidth disabled={!date || count === 0}>
                Continuar <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={nextFromCustomer} className="checkout-form">
              <button
                type="button"
                className="text-link checkout-back"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
              >
                <ArrowLeft size={14} aria-hidden="true" /> Voltar à visita
              </button>
              <h3 ref={stepTitle} tabIndex={-1}>
                Quem vai viver essa aventura?
              </h3>
              <div className="form-field">
                <label htmlFor="customer-name">Nome completo</label>
                <input
                  id="customer-name"
                  value={customer.name}
                  onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                  autoComplete="name"
                  placeholder="Seu nome e sobrenome"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>
              <div className="form-field">
                <label htmlFor="customer-email">E-mail</label>
                <input
                  id="customer-email"
                  type="email"
                  value={customer.email}
                  onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  required
                  maxLength={150}
                />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="customer-cpf">CPF {isDemo && <span>(opcional)</span>}</label>
                  <input
                    id="customer-cpf"
                    inputMode="numeric"
                    value={customer.cpf}
                    onChange={(event) =>
                      setCustomer({ ...customer, cpf: formatCPF(event.target.value) })
                    }
                    placeholder="000.000.000-00"
                    required={!isDemo}
                    maxLength={14}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="customer-phone">
                    Celular {isDemo && <span>(opcional)</span>}
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    inputMode="tel"
                    value={customer.phone}
                    onChange={(event) =>
                      setCustomer({ ...customer, phone: formatPhone(event.target.value) })
                    }
                    autoComplete="tel-national"
                    placeholder="(00) 00000-0000"
                    required={!isDemo}
                    maxLength={15}
                  />
                </div>
              </div>
              <p className="form-hint">
                {isDemo
                  ? 'Seus dados ficam apenas nesta simulação e são apagados ao fechar esta janela.'
                  : 'Confira seus dados antes de enviar o pedido ao serviço de ingressos.'}
              </p>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" fullWidth>
                Revisar minha visita <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </form>
          )}
          {step === 3 && (
            <div className="checkout-form">
              <button
                className="text-link checkout-back"
                onClick={() => {
                  setStep(2);
                  setError('');
                }}
                disabled={processing}
              >
                <ArrowLeft size={14} aria-hidden="true" /> Voltar aos dados
              </button>
              <h3 ref={stepTitle} tabIndex={-1}>
                Tudo pronto para a próxima história?
              </h3>
              <dl className="checkout-review">
                <div>
                  <dt>Visitante</dt>
                  <dd>{customer.name}</dd>
                </div>
                <div>
                  <dt>E-mail</dt>
                  <dd>{customer.email}</dd>
                </div>
                <div>
                  <dt>Sua visita</dt>
                  <dd>{formattedDate}</dd>
                </div>
                {ticketLabels
                  .filter(({ id }) => tickets[id] > 0)
                  .map(({ id, label }) => (
                    <div key={id}>
                      <dt>
                        {tickets[id]} × {label}
                      </dt>
                      <dd>{formatCurrency(tickets[id] * TICKET_PRICES[id])}</dd>
                    </div>
                  ))}
                <div className="checkout-review__total">
                  <dt>Total {isDemo && 'estimado'}</dt>
                  <dd>{formatCurrency(total)}</dd>
                </div>
              </dl>
              <fieldset className="payment-methods" disabled={processing}>
                <legend>Preferência de pagamento</legend>
                {[
                  { value: 'pix' as const, label: 'Pix', icon: Wallet },
                  { value: 'credit_card' as const, label: 'Cartão', icon: CreditCard },
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className={paymentMethod === value ? 'is-selected' : ''}>
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                    />
                    <Icon size={20} strokeWidth={1.4} aria-hidden="true" />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>
              <p className="form-hint">
                {isDemo
                  ? 'Nenhum dado bancário é solicitado. A simulação não reserva a data nem garante disponibilidade.'
                  : 'A confirmação depende do serviço de ingressos e da disponibilidade.'}
              </p>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <Button fullWidth onClick={() => void confirm()} disabled={processing}>
                {processing ? (
                  <>
                    <LoaderCircle size={17} className="spin" aria-hidden="true" /> Aguardando
                    confirmação…
                  </>
                ) : (
                  <>
                    {isDemo ? 'Concluir simulação' : 'Confirmar pedido'}
                    <ArrowRight size={17} aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          )}
          {step === 4 && (
            <div className="checkout-success">
              <span className="checkout-success__icon">
                <CheckCircle2 size={37} strokeWidth={1.2} aria-hidden="true" />
              </span>
              <h3 ref={stepTitle} tabIndex={-1}>
                {isDemo ? 'Sua aventura está planejada.' : 'Pedido confirmado.'}
              </h3>
              <p>
                {isDemo
                  ? 'Simulação concluída! Não houve cobrança nem emissão de ingressos. Agora, fale com a equipe para confirmar sua visita.'
                  : 'O serviço de ingressos confirmou o pedido. Consulte a equipe para acompanhar a emissão dos ingressos.'}
              </p>
              <div className="checkout-success__summary">
                <CalendarDays size={20} aria-hidden="true" />
                <div>
                  <strong>{formattedDate}</strong>
                  <span>
                    {count} {count === 1 ? 'ingresso' : 'ingressos'} · {formatCurrency(total)}
                  </span>
                </div>
              </div>
              <a
                className="button button--primary button--full"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
              >
                Falar com a equipe <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <Button variant="ghost" fullWidth onClick={onClose}>
                Continuar explorando
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
