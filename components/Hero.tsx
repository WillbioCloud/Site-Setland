import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import medievalBg from '../assets/castelo-bg.webp';
import glacialCastle from '../assets/fundo-castelo.webp';
import glacialOverlay from '../assets/blue-background.webp';

const VIDEO_URL =
  "https://res.cloudinary.com/dxplpg36m/video/upload/v1765849320/V%C3%ADdeo_Drone_Castelo_Setland_Gerado_emeqwk.mp4";

interface HeroProps {
  onOpenTickets: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTickets }) => {
  const { currentTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [robotScale, setRobotScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  /* ================= MOUSE PARALLAX ================= */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (currentTheme === 'medieval' || currentTheme === 'futuristic') {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    }
  };

  /* ================= ZOOM NO SCROLL (ROBO) ================= */
  useEffect(() => {
    if (currentTheme !== 'futuristic') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 1.2;

      const progress = Math.min(scrollY / maxScroll, 1);
      const scale = 1 + progress * 1.35; // até ~1.35

      setRobotScale(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentTheme]);

  const scrollToEras = () => {
    document.querySelector('#eras')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden transition-colors duration-700 bg-slate-900"
      onMouseMove={handleMouseMove}
    >
      {/* ================= FUNDO ================= */}
      <div className="absolute inset-0 z-0 opacity-90 overflow-hidden">

        {/* GLACIAL */}
        {currentTheme === 'glacial' ? (
          <>
            <img
              src={glacialCastle}
              alt="Castelo de Gelo"
              className="w-full h-full object-cover filter brightness-90 contrast-110 hue-rotate-[10deg]"
            />
            <img
              src={glacialOverlay}
              alt="Textura de Gelo"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/20 to-cyan-900/60" />
          </>
        ) : currentTheme === 'medieval' ? (
          <>
            <img
              src={medievalBg}
              alt="Castelo Medieval"
              className="w-full h-full object-cover sepia-[0.3] scale-105"
              style={{
                transform: `scale(1.1) translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a1b15] via-[#2a1b15]/60 to-transparent" />
          </>
        ) : currentTheme === 'futuristic' ? (
          <div className="relative w-full h-full bg-black overflow-hidden">

            {/* ROBÔ 3D (INTERATIVO + ZOOM) */}
            <iframe
              ref={iframeRef}
              src="https://my.spline.design/nexbotrobotcharacterconcept-AsVPy3klbyluz38LyvcH0hWz/"
              className="absolute inset-0 w-full h-full transition-transform duration-75"
              style={{
                transform: `scale(${robotScale})`
              }}
              frameBorder="0"
            />

            {/* OVERLAYS (NÃO BLOQUEIAM MOUSE) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none z-10" />
          </div>
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        )}
      </div>

      {/* --- CONTEÚDO CENTRAL --- */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        
        {/* Tagline */}
        <span className={`inline-block py-1 px-3 rounded-full text-sm font-bold mb-6 animate-fade-in border
          ${currentTheme === 'glacial' ? 'bg-white/20 text-white border-white/40 shadow-lg backdrop-blur-md' : 
            currentTheme === 'medieval' ? 'bg-[#f5e6d3]/10 text-[#f5e6d3] border-[#f5e6d3]/50 font-serif tracking-widest' : 
            currentTheme === 'futuristic' ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50 font-mono' :
            'bg-accent/20 text-accent border-accent/30'}`}
        >
          {currentTheme === 'glacial' ? 'O REINO DE GELO ETERNO' : 
           currentTheme === 'medieval' ? 'HONRA . GLÓRIA . LENDA' : 
           currentTheme === 'futuristic' ? 'SYSTEM.INIT(ADVENTURE)' : 
           'O MAIOR PARQUE DE CALDAS NOVAS'}
        </span>
        
        {/* Headline */}
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight animate-slide-up
          ${currentTheme === 'glacial' ? 'font-display tracking-wide drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400' : 
            currentTheme === 'medieval' ? 'font-medieval tracking-normal text-[#f5e6d3] drop-shadow-xl' : 
            currentTheme === 'futuristic' ? 'font-future uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]' :
            'font-display'}`}
        >
          {currentTheme === 'glacial' ? 'A ERA GLACIAL' : 
           currentTheme === 'medieval' ? 'A ERA MEDIEVAL' : 
           currentTheme === 'futuristic' ? 'NEON FUTURE' : (
             <>DESCUBRA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500">NOVOS MUNDOS</span></>
          )}
        </h1>
        
        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up delay-200
          ${currentTheme === 'glacial' ? 'text-white drop-shadow-md font-medium' : 
            currentTheme === 'medieval' ? 'text-[#eaddcf] font-serif italic opacity-90' : 
            currentTheme === 'futuristic' ? 'text-cyan-300 font-mono' :
            'text-slate-200'}`}
        >
          {currentTheme === 'glacial' ? 'Enfrente ventos congelantes e descubra criaturas titânicas sob o gelo.' : 
           currentTheme === 'medieval' ? 'Castelos, dragões e duelos épicos. Sua jornada heroica começa agora.' : 
           currentTheme === 'futuristic' ? 'Realidade aumentada, velocidade da luz e o amanhã, hoje.' :
           'Uma experiência imersiva através do tempo. Do gelo eterno ao futuro neon.'}
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center animate-slide-up delay-300">
          <Button 
            size="lg" 
            onClick={onOpenTickets}
            variant={currentTheme === 'futuristic' ? 'neon' : currentTheme === 'medieval' ? 'medieval' : currentTheme === 'glacial' ? 'glacial' : 'primary'}
          >
            {currentTheme === 'medieval' ? 'Garantir Vaga' : currentTheme === 'futuristic' ? 'Acessar Sistema' : 'Garantir Ingressos'}
          </Button>
          <Button 
            size="lg" 
            variant={currentTheme === 'futuristic' ? 'outline-neon' : currentTheme === 'medieval' ? 'outline-medieval' : currentTheme === 'glacial' ? 'outline-glacial' : 'outline'}
            onClick={scrollToEras}
          >
            {currentTheme === 'medieval' ? 'Ver o Reino' : 'Explorar'}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};