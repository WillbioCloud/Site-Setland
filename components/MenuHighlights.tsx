import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMenuItemAnchor } from '../data/menuDisplay';
import mignon from '../assets/mignon-parmegiana.webp';
import entradas from '../assets/optimized/entradas.webp';

const highlights = [
  {
    name: 'Mignon à parmegiana',
    detail: 'Uma pausa à altura da aventura',
    price: 'R$ 57,77',
    category: 'pratos',
    itemName: 'FILÉ MIGNON À PARMEGIANA',
  },
  {
    name: 'Panelinha goiana Setland',
    detail: 'Sabores da nossa terra, para dois',
    price: 'R$ 77,77',
    category: 'panelinhas',
    itemName: 'PANELINHA GOIANA SETLAND',
  },
  {
    name: 'Pizza Setland',
    detail: 'Cordeiro, muçarela e pesto · média',
    price: 'R$ 77,77',
    category: 'pizzas',
    itemName: 'SETLAND',
  },
] as const;

export function MenuHighlights() {
  return (
    <section id="menu" className="section gastronomy-section">
      <div className="container gastronomy-grid">
        <div className="gastronomy-visual">
          <div className="gastronomy-visual__main">
            <img
              src={mignon}
              alt="Filé mignon à parmegiana do cardápio Setland"
              loading="lazy"
              width="770"
              height="514"
            />
            <div className="gastronomy-visual__caption">
              <UtensilsCrossed size={19} strokeWidth={1.4} aria-hidden="true" />
              <span>À mesa, novas histórias.</span>
            </div>
          </div>
          <img
            className="gastronomy-visual__inset"
            src={entradas}
            alt="Pão e acompanhamentos do couvert"
            width="240"
            height="240"
            loading="lazy"
          />
          <span className="gastronomy-visual__index">UMA EXPERIÊNCIA PARA TODOS OS SENTIDOS</span>
        </div>
        <div className="gastronomy-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" /> Gastronomia Setland
          </span>
          <h2>
            A aventura
            <br />
            também <span className="text-gold">tem sabor.</span>
          </h2>
          <p>
            Entre uma descoberta e outra, sente-se à mesa. Sabores para compartilhar, brindar e
            transformar uma pausa em mais uma boa lembrança.
          </p>
          <div className="menu-highlights">
            {highlights.map((item) => (
              <Link
                className="menu-highlight"
                to={`/cardapio#${getMenuItemAnchor(item.category, item.itemName)}`}
                key={item.name}
              >
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.detail}</span>
                </div>
                <strong>{item.price}</strong>
              </Link>
            ))}
          </div>
          <Link to="/cardapio" className="button button--outline">
            Explore o cardápio <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
