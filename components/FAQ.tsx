import { useState } from 'react';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { faqs } from '../data/visit';
import { INSTAGRAM_URL } from '../data/park';

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="section faq-section">
      <div className="container faq-grid">
        <div className="faq-intro">
          <span className="eyebrow">
            <span className="eyebrow-line" /> Antes da aventura
          </span>
          <h2>
            Curiosidade faz
            <br />
            <span className="text-gold">parte da viagem.</span>
          </h2>
          <p>
            As respostas para você chegar
            <br />
            com tudo planejado.
          </p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-link">
            Fale com a equipe <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="faq-list">
          {faqs.map(({ question, answer }, index) => (
            <div className={`faq-item ${open === index ? 'is-open' : ''}`} key={question}>
              <h3>
                <button
                  id={`faq-question-${index}`}
                  onClick={() => setOpen(open === index ? null : index)}
                  aria-expanded={open === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-item__number">0{index + 1}</span>
                  <span>{question}</span>
                  {open === index ? (
                    <Minus size={19} aria-hidden="true" />
                  ) : (
                    <Plus size={19} aria-hidden="true" />
                  )}
                </button>
              </h3>
              <div
                id={`faq-answer-${index}`}
                aria-labelledby={`faq-question-${index}`}
                role="region"
                hidden={open !== index}
              >
                <p>{answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
