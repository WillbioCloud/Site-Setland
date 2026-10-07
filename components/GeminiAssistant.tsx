import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Compass, LoaderCircle, MessageCircle, Send, Ticket } from 'lucide-react';
import { getGeminiResponse, hasConnectedAssistant } from '../services/geminiService';
import { Modal } from './Modal';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

export function GeminiAssistant({ onOpenTickets }: { onOpenTickets: () => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: 'bot',
      text: 'Olá, viajante! Vamos planejar uma boa história? Posso ajudar você a conhecer o Setland e preparar sua visita.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sending = useRef(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  const send = async (text = input) => {
    const message = text.trim();
    if (!message || sending.current) return;
    sending.current = true;
    setLoading(true);
    setInput('');
    setMessages((previous) => [...previous, { id: Date.now(), sender: 'user', text: message }]);
    try {
      const reply = await getGeminiResponse(message);
      setMessages((previous) => [...previous, { id: Date.now() + 1, sender: 'bot', text: reply }]);
    } finally {
      sending.current = false;
      setLoading(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <>
      <button
        className="assistant-launcher"
        onClick={() => setOpen(true)}
        aria-label="Abrir guia virtual do Setland"
        aria-haspopup="dialog"
      >
        <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
        <span>Posso ajudar?</span>
        <span className="assistant-launcher__dot" />
      </button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        titleId="assistant-title"
        className="assistant-dialog"
        closeLabel="Fechar guia virtual"
      >
        <div className="assistant-header">
          <span className="assistant-avatar">
            <Compass size={24} strokeWidth={1.3} aria-hidden="true" />
          </span>
          <div>
            <h2 id="assistant-title">Seu guia Setland</h2>
            <p>{hasConnectedAssistant ? 'Assistente virtual' : 'Informações para sua visita'}</p>
          </div>
        </div>
        <div
          className="assistant-messages"
          ref={scrollRef}
          role="log"
          aria-label="Conversa com o guia"
          aria-live="polite"
          aria-relevant="additions text"
        >
          <span className="assistant-greeting">Toda grande aventura começa com uma pergunta.</span>
          {messages.map((message) => (
            <div key={message.id} className={`chat-message chat-message--${message.sender}`}>
              <span className="sr-only">{message.sender === 'bot' ? 'Guia: ' : 'Você: '}</span>
              {message.text}
            </div>
          ))}
          {messages.length === 1 && (
            <div className="assistant-suggestions">
              {['Horários de visita', 'Parque de Gelo', 'Ingressos e valores'].map((suggestion) => (
                <button key={suggestion} onClick={() => void send(suggestion)}>
                  {suggestion}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
          {loading && (
            <div className="assistant-thinking" role="status">
              <LoaderCircle size={16} className="spin" aria-hidden="true" /> Consultando o guia…
            </div>
          )}
        </div>
        <div className="assistant-input-area">
          <button
            className="assistant-ticket-link"
            onClick={() => {
              setOpen(false);
              onOpenTickets();
            }}
          >
            <Ticket size={15} aria-hidden="true" /> Planejar minha visita{' '}
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <label className="sr-only" htmlFor="assistant-message">
              Sua pergunta
            </label>
            <input
              ref={inputRef}
              id="assistant-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="O que você quer descobrir?"
              maxLength={600}
              autoComplete="off"
            />
            <button
              type="submit"
              className="icon-button"
              aria-label="Enviar pergunta"
              disabled={loading || !input.trim()}
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
          <p>Não compartilhe dados pessoais ou de pagamento.</p>
        </div>
      </Modal>
    </>
  );
}
