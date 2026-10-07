import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Castle,
  MapPin,
  Pause,
  Play,
  Snowflake,
  Ticket,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Modal } from './Modal';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CASTLE_IMAGE, HERO_VIDEO_URL } from '../data/park';

const copy = {
  default: {
    first: 'Uma viagem',
    second: 'além do tempo.',
    description:
      'Entre castelos, reinos de gelo e novos mundos. Viva uma experiência que só existe no Setland.',
  },
  glacial: {
    first: 'O frio encanta.',
    second: 'A memória fica.',
    description:
      'Um reino a −17 °C, encontros inesperados e descobertas para aquecer suas melhores lembranças.',
  },
  medieval: {
    first: 'Entre no castelo.',
    second: 'Viva sua história.',
    description:
      'Atravesse as muralhas, descubra a vila e faça parte de uma aventura que vai muito além da imaginação.',
  },
  futuristic: {
    first: 'Um novo mundo.',
    second: 'Um novo olhar.',
    description:
      'Luzes, personagens e cenários que levam sua imaginação a uma nova dimensão. O próximo capítulo é seu.',
  },
};

export function Hero({ onOpenTickets }: { onOpenTickets: () => void }) {
  const { currentTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [filmFailed, setFilmFailed] = useState(false);
  const content = copy[currentTheme];

  useEffect(() => {
    const element = video.current;
    if (!element || videoFailed) return;
    let visible = true;
    const updatePlayback = () => {
      if (!visible || document.hidden || reducedMotion || manuallyPaused.current || filmOpen)
        element.pause();
      else void element.play().catch(() => setPlaying(false));
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.05 },
    );
    observer.observe(element);
    updatePlayback();
    document.addEventListener('visibilitychange', updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updatePlayback);
    };
  }, [reducedMotion, videoFailed, filmOpen]);

  const toggleVideo = () => {
    if (!video.current) return;
    if (playing) {
      manuallyPaused.current = true;
      video.current.pause();
    } else {
      manuallyPaused.current = false;
      void video.current.play().catch(() => setVideoFailed(true));
    }
  };

  return (
    <>
      <section className="hero" id="hero" aria-label="Bem-vindo ao Setland">
        <div className="hero__media" aria-hidden="true">
          <img
            src={CASTLE_IMAGE}
            alt=""
            className="hero__poster"
            width="1200"
            height="800"
            fetchPriority="high"
          />
          {!videoFailed && (
            <video
              ref={video}
              src={HERO_VIDEO_URL}
              poster={CASTLE_IMAGE}
              autoPlay={!reducedMotion}
              loop
              muted
              playsInline
              preload={reducedMotion ? 'none' : 'metadata'}
              className="hero__video object-cover"
              tabIndex={-1}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onError={() => {
                setVideoFailed(true);
                setPlaying(false);
              }}
            />
          )}
          <div className="hero__shade" />
          <div className="hero__vignette" />
        </div>
        <div className="container hero__main">
          <div className="hero__copy" key={currentTheme}>
            <div className="eyebrow hero__eyebrow">
              <span className="eyebrow-line" /> Um destino. Três eras. Infinitas histórias.
            </div>
            <h1>
              {content.first}
              <br />
              <span>{content.second}</span>
            </h1>
            <p className="hero__description">{content.description}</p>
            <div className="hero__actions">
              <Button size="lg" onClick={onOpenTickets}>
                <Ticket size={18} strokeWidth={1.7} aria-hidden="true" /> Garanta seu ingresso{' '}
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
              <Link to="/#eras" className="button button--outline button--lg">
                Explore as 3 eras <ArrowDown size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="hero__footnote">Grandes histórias começam com uma nova descoberta.</p>
          </div>
          <ThemeSwitcher variant="hero" />
        </div>
        <div className="container hero__bottom">
          <div className="hero__location">
            <MapPin size={19} strokeWidth={1.4} aria-hidden="true" />
            <div>
              <span>Caldas Novas, Goiás</span>
              <small>O extraordinário mora aqui.</small>
            </div>
          </div>
          <Link className="hero__scroll" to="/#eras">
            <span className="scroll-line" /> Role para descobrir
          </Link>
          <div className="hero__film-actions">
            {!videoFailed && (
              <button
                className="icon-button video-toggle"
                aria-label={playing ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}
                onClick={toggleVideo}
              >
                {playing ? (
                  <Pause size={14} aria-hidden="true" />
                ) : (
                  <Play size={14} aria-hidden="true" />
                )}
              </button>
            )}
            <button
              className="film-link"
              aria-label="Assistir ao filme sobre o Setland"
              onClick={() => {
                setFilmFailed(false);
                setFilmOpen(true);
              }}
            >
              <span className="film-link__play">
                <Play size={15} fill="currentColor" aria-hidden="true" />
              </span>
              <span>
                Um olhar sobre o Setland<small>Assista ao filme</small>
              </span>
            </button>
          </div>
        </div>
      </section>
      <div className="experience-strip">
        <div className="container experience-strip__inner">
          {[
            {
              icon: Castle,
              title: '3 eras, um só destino',
              description: 'Uma viagem pela imaginação',
            },
            {
              icon: Snowflake,
              title: 'Surpreenda-se a −17 °C',
              description: 'Conheça o Parque de Gelo',
            },
            {
              icon: UtensilsCrossed,
              title: 'Sabores que encantam',
              description: 'Uma pausa para compartilhar',
            },
            {
              icon: Users,
              title: 'Memórias em família',
              description: 'Histórias para levar com você',
            },
          ].map(({ icon: Icon, title, description }) => (
            <div className="experience-strip__item" key={title}>
              <Icon size={23} strokeWidth={1.25} aria-hidden="true" />
              <div>
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={filmOpen}
        onClose={() => setFilmOpen(false)}
        titleId="film-title"
        className="film-modal"
      >
        <div className="film-modal__heading">
          <span className="eyebrow">Deixe a imaginação viajar</span>
          <h2 id="film-title">Um olhar sobre o Setland</h2>
        </div>
        {filmFailed ? (
          <div className="film-fallback">
            <img src={CASTLE_IMAGE} alt="Fachada iluminada do castelo Setland ao anoitecer" />
            <p>
              O filme está indisponível no momento. A aventura continua: explore as eras e conheça o
              parque pelas fotos.
            </p>
            <Button variant="outline" onClick={() => setFilmOpen(false)}>
              Continuar explorando <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <video
            src={HERO_VIDEO_URL}
            poster={CASTLE_IMAGE}
            controls
            autoPlay={!reducedMotion}
            muted
            playsInline
            preload="metadata"
            aria-label="Vídeo panorâmico do castelo Setland, sem narração"
            onError={() => setFilmFailed(true)}
          />
        )}
      </Modal>
    </>
  );
}
