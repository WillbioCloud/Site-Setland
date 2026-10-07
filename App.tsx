import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowLeft, Castle, LoaderCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TicketModal } from './components/TicketModal';
import { GeminiAssistant } from './components/GeminiAssistant';
import { ThemeProvider } from './context/ThemeContext';
import { useReducedMotion } from './hooks/useReducedMotion';
import { Home } from './pages/Home';

const FullMenu = lazy(() =>
  import('./pages/FullMenu').then((module) => ({ default: module.FullMenu })),
);

function RouteEffects() {
  const { pathname, hash, key } = useLocation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.title =
      pathname === '/cardapio'
        ? 'Gastronomia — Setland'
        : pathname === '/'
          ? 'Setland — Uma viagem além do tempo'
          : 'Página não encontrada — Setland';
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const frame = requestAnimationFrame(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key, reducedMotion]);
  return null;
}

function NotFound() {
  return (
    <section className="not-found container">
      <Castle size={46} strokeWidth={1.1} aria-hidden="true" />
      <span className="eyebrow">404 · Fora do mapa</span>
      <h1>
        Uma nova rota
        <br />
        para a sua aventura.
      </h1>
      <p>Esta página não foi encontrada. Vamos voltar ao castelo?</p>
      <Link to="/" className="button button--primary">
        <ArrowLeft size={17} aria-hidden="true" /> Voltar para o parque
      </Link>
    </section>
  );
}

function AppContent() {
  const [ticketOpen, setTicketOpen] = useState(false);
  const openTickets = () => setTicketOpen(true);

  return (
    <BrowserRouter>
      <RouteEffects />
      <div className="site-shell">
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo
        </a>
        <Navbar onOpenTickets={openTickets} />
        <main id="main-content" tabIndex={-1}>
          <Suspense
            fallback={
              <div className="page-loading" role="status">
                <LoaderCircle size={23} className="spin" aria-hidden="true" /> Preparando sua
                próxima descoberta…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home onOpenTickets={openTickets} />} />
              <Route path="/cardapio" element={<FullMenu />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <TicketModal isOpen={ticketOpen} onClose={() => setTicketOpen(false)} />
        <GeminiAssistant onOpenTickets={openTickets} />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
