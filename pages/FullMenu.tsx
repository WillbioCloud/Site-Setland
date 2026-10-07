import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, Info, Search, Crown, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { menuData } from '../data/menu';
import { normalizeMenuSearch as normalize } from '../data/menuDisplay';
import { menuCategoryPresentation } from '../data/menuMedia';
import { MenuCategorySection } from '../components/menu/MenuCategorySection';
import { useReducedMotion } from '../hooks/useReducedMotion';
import mignon from '../assets/mignon-parmegiana.webp';
import '../styles/menu.css';

export function FullMenu() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('couvert');
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = normalize(query);
  const previousQuery = useRef(normalizedQuery);
  const resultsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () =>
      menuData
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            normalize(
              `${category.title} ${item.name} ${item.description ?? ''} ${menuCategoryPresentation[category.id].badge} ${menuCategoryPresentation[category.id].introduction}`,
            ).includes(normalizedQuery),
          ),
        }))
        .filter((category) => category.items.length > 0),
    [normalizedQuery],
  );
  const itemCount = categories.reduce((sum, category) => sum + category.items.length, 0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const firstCategory = document.getElementById(`cat-${categories[0]?.id}`);
      const scrollMargin = firstCategory
        ? parseFloat(getComputedStyle(firstCategory).scrollMarginTop)
        : 0;
      const offset = (Number.isFinite(scrollMargin) ? scrollMargin : 196) + 5;
      let active = categories[0]?.id ?? '';
      for (const category of categories) {
        const element = document.getElementById(`cat-${category.id}`);
        if (element && element.getBoundingClientRect().top <= offset) active = category.id;
      }
      setActiveCategory(active);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [categories]);

  // Keep the results in view when a visitor searches from a category far down the catalog.
  useEffect(() => {
    if (previousQuery.current === normalizedQuery) return;
    previousQuery.current = normalizedQuery;
    const frame = requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [normalizedQuery]);

  useEffect(() => {
    if (!location.hash) return;
    const frame = requestAnimationFrame(() => {
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash, reducedMotion]);

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !active) return;
    if (window.innerWidth < 800)
      nav.scrollTo({
        left: active.offsetLeft - nav.offsetLeft - 24,
        behavior: reducedMotion ? 'instant' : 'smooth',
      });
    else if (
      active.offsetTop < nav.scrollTop ||
      active.offsetTop + active.offsetHeight > nav.scrollTop + nav.clientHeight
    )
      nav.scrollTo({ top: active.offsetTop - 80, behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [activeCategory, reducedMotion]);

  return (
    <div className="menu-page">
      <section className="menu-page-hero">
        <div className="menu-page-hero__image" aria-hidden="true">
          <img src={mignon} alt="" width="770" height="514" fetchPriority="high" />
        </div>
        <div className="container menu-page-hero__inner">
          <nav className="breadcrumbs" aria-label="Caminho de navegação">
            <Link to="/">O parque</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">Gastronomia</span>
          </nav>
          <span className="eyebrow">
            <span className="eyebrow-line" /> O verdadeiro sabor da realeza
          </span>
          <h1>
            Uma aventura
            <br />
            <span className="text-gold">de sabores.</span>
          </h1>
          <p>
            Saboreie cada pausa. Encontre o seu próximo favorito
            <br className="desktop-break" /> no cardápio do Setland.
          </p>
          <div className="menu-page-hero__signature">
            <Crown size={19} strokeWidth={1.3} aria-hidden="true" /> À mesa da Corte, cada sabor
            conta uma história.
          </div>
        </div>
      </section>
      <div className="menu-search-bar">
        <div className="container menu-search-bar__inner">
          <label className="menu-search">
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">Buscar no cardápio</span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="O que você está com vontade de provar?"
              autoComplete="off"
            />
            {query && (
              <button
                className="icon-button"
                aria-label="Limpar busca"
                onClick={() => {
                  setQuery('');
                  searchRef.current?.focus();
                }}
              >
                <X size={17} aria-hidden="true" />
              </button>
            )}
          </label>
          <span className="menu-search-count" role="status" aria-live="polite">
            {itemCount} {itemCount === 1 ? 'opção' : 'opções'}{' '}
            <span>
              · {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
            </span>
          </span>
        </div>
      </div>
      <div className="container menu-layout">
        <aside className="menu-sidebar">
          <span className="eyebrow">Encontre seu sabor</span>
          <nav ref={navRef} className="menu-categories" aria-label="Categorias do cardápio">
            {categories.map(({ id, title, icon: Icon, items }) => (
              <Link
                to={`#cat-${id}`}
                key={id}
                className={`menu-category-link ${activeCategory === id ? 'is-active' : ''}`}
                aria-current={activeCategory === id ? 'location' : undefined}
                onClick={() => setActiveCategory(id)}
              >
                <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
                <span>{title}</span>
                <small>{items.length}</small>
              </Link>
            ))}
          </nav>
          <Link className="menu-back text-link" to="/">
            <ArrowLeft size={15} aria-hidden="true" /> Voltar para o parque
          </Link>
        </aside>
        <div className="menu-content" ref={resultsRef} aria-label="Pratos e bebidas">
          {categories.length === 0 ? (
            <div className="menu-empty">
              <Search size={32} strokeWidth={1.2} aria-hidden="true" />
              <h2>Nenhum sabor por aqui.</h2>
              <p>
                Não encontramos resultados para “{query}”.
                <br />
                Tente o nome de um prato, ingrediente ou categoria.
              </p>
              <button
                className="button button--outline"
                onClick={() => {
                  setQuery('');
                  searchRef.current?.focus();
                }}
              >
                Ver todo o cardápio <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            categories.map((category) => (
              <MenuCategorySection
                key={category.id}
                category={category}
                chapter={menuData.findIndex((original) => original.id === category.id) + 1}
              />
            ))
          )}
          <div className="menu-notice">
            <Info size={19} aria-hidden="true" />
            <p>
              Cardápio para consulta. Faça seu pedido com a equipe no parque.
              <br />
              Preços e disponibilidade sujeitos a alteração. Informe alergias e restrições
              alimentares antes de pedir. Imagens de referência por categoria; a apresentação do
              prato pode variar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
