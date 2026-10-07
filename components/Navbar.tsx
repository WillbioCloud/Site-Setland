import { useEffect, useState } from 'react';
import { ArrowUpRight, MapPin, Menu, Ticket } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Brand } from './Brand';
import { Button } from './Button';
import { Modal } from './Modal';
import { ThemeSwitcher } from './ThemeSwitcher';

const links = [
  { to: '/#hero', label: 'O parque', section: 'hero' },
  { to: '/#eras', label: 'As 3 eras', section: 'eras' },
  { to: '/#atracoes', label: 'Atrações', section: 'atracoes' },
  { to: '/cardapio', label: 'Gastronomia', section: 'menu' },
  { to: '/#visita', label: 'Planeje sua visita', section: 'visita' },
];

export function Navbar({ onOpenTickets }: { onOpenTickets: () => void }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [section, setSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    if (location.pathname !== '/') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setSection(entry.target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' },
    );
    document.querySelectorAll('main section[id]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1100px)');
    const onChange = () => {
      if (media.matches) setMobileOpen(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const active = (id: string) =>
    location.pathname === '/cardapio' ? id === 'menu' : location.pathname === '/' && section === id;

  return (
    <>
      <header
        className={`site-header ${scrolled || location.pathname !== '/' ? 'is-scrolled' : ''}`}
      >
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegação principal">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${active(link.section) ? 'is-active' : ''}`}
                aria-current={active(link.section) ? 'location' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <ThemeSwitcher />
            <Button size="sm" onClick={onOpenTickets} className="header-ticket">
              <Ticket size={16} aria-hidden="true" /> Ingressos{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
            <button
              className="icon-button mobile-nav-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu de navegação"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <Menu size={23} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <Modal
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        titleId="mobile-menu-title"
        className="mobile-menu"
        closeLabel="Fechar menu de navegação"
      >
        <div className="mobile-menu__brand">
          <Brand onClick={() => setMobileOpen(false)} />
        </div>
        <h2 id="mobile-menu-title" className="eyebrow">
          Sua próxima descoberta
        </h2>
        <nav id="mobile-navigation" aria-label="Navegação mobile">
          {links.map((link, index) => (
            <Link
              to={link.to}
              key={link.to}
              onClick={() => setMobileOpen(false)}
              className={active(link.section) ? 'is-active' : ''}
            >
              <span>0{index + 1}</span>
              {link.label}
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <Button
          fullWidth
          onClick={() => {
            setMobileOpen(false);
            onOpenTickets();
          }}
        >
          <Ticket size={17} aria-hidden="true" /> Planejar minha aventura
        </Button>
        <p className="mobile-menu__location">
          <MapPin size={15} aria-hidden="true" /> Caldas Novas, Goiás
        </p>
      </Modal>
    </>
  );
}
