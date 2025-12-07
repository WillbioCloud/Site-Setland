import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { ChevronDown, Snowflake, Crown, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeEra } from '../types';

interface HeroProps {
  onOpenTickets: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTickets }) => {
  const { currentTheme, setTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle Parallax for Medieval/Futuristic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (currentTheme === 'medieval' || currentTheme === 'futuristic') {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    }
  };

  const scrollToEras = () => {
    document.querySelector('#eras')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Content based on theme
  const getThemeContent = () => {
    switch (currentTheme) {
      case 'glacial':
        return {
          tagline: 'O REINO DE GELO ETERNO',
          headline: 'A ERA GLACIAL',
          sub: 'Enfrente ventos congelantes e descubra criaturas titânicas sob o gelo.',
          video: 'https://cdn.coverr.co/videos/coverr-flying-over-snowy-mountains-2849/1080p.mp4', // Free sample
          bgClass: 'bg-glacial-base'
        };
      case 'medieval':
        return {
          tagline: 'HONRA . GLÓRIA . LENDA',
          headline: 'A ERA MEDIEVAL',
          sub: 'Castelos, dragões e duelos épicos. Sua jornada heroica começa agora.',
          image: 'https://picsum.photos/seed/castle-hero/1920/1080',
          bgClass: 'bg-medieval-base'
        };
      case 'futuristic':
        return {
          tagline: 'SYSTEM.INIT(ADVENTURE)',
          headline: 'NEON FUTURE',
          sub: 'Realidade aumentada, velocidade da luz e o amanhã, hoje.',
          bgClass: 'bg-future-base'
        };
      default:
        return {
          tagline: 'O MAIOR PARQUE DE CALDAS NOVAS',
          headline: 'DESCUBRA NOVOS MUNDOS',
          sub: 'Uma experiência imersiva através do tempo. Do gelo eterno ao futuro neon.',
          image: 'https://picsum.photos/seed/theme-park-hero/1920/1080',
          bgClass: 'bg-slate-900'
        };
    }
  };

  const content = getThemeContent();

  return (
    <section 
      id="hero" 
      className={`relative h-screen flex items-center justify-center overflow-hidden transition-colors duration-700 ${content.bgClass}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {currentTheme === 'glacial' ? (
           <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 filter blur-[2px]">
             <source src={content.video} type="video/mp4" />
           </video>
        ) : currentTheme === 'futuristic' ? (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-future-base via-slate-900 to-black">
             <div className="absolute inset-0 cyber-grid opacity-30 animate-pulse"></div>
          </div>
        ) : (
          <img 
            src={content.image} 
            alt="Hero Background" 
            className={`w-full h-full object-cover transition-transform duration-100 ease-out ${currentTheme === 'medieval' ? 'sepia-[0.3]' : ''}`}
            style={currentTheme === 'medieval' ? { transform: `scale(1.1) translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` } : {}}
          />
        )}
        
        {/* Overlay Gradients */}
        <div className={`absolute inset-0 bg-gradient-to-t 
          ${currentTheme === 'glacial' ? 'from-glacial-base via-glacial-base/60 to-transparent' : 
            currentTheme === 'medieval' ? 'from-medieval-base via-medieval-base/80 to-transparent' : 
            currentTheme === 'futuristic' ? 'from-future-base via-future-base/90 to-transparent' : 
            'from-slate-900 via-slate-900/60 to-transparent'}`}
        ></div>

        {/* Scanline for Future */}
        {currentTheme === 'futuristic' && (
          <div className="absolute inset-0 bg-transparent z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        )}
      </div>

      {/* Theme Switcher for Prototype */}
      <div className="absolute top-24 md:top-8 right-4 md:right-8 z-30 flex flex-col gap-2">
        <span className="text-xs font-bold text-white/50 uppercase text-right">Mudar Tema</span>
        <div className="flex gap-2">
          <button onClick={() => setTheme('glacial')} className={`p-2 rounded-full backdrop-blur-md border transition-all ${currentTheme === 'glacial' ? 'bg-glacial-accent text-slate-900 border-glacial-accent' : 'bg-black/30 text-white border-white/20'}`} title="Glacial">
            <Snowflake size={20} />
          </button>
          <button onClick={() => setTheme('medieval')} className={`p-2 rounded-full backdrop-blur-md border transition-all ${currentTheme === 'medieval' ? 'bg-medieval-accent text-medieval-base border-medieval-accent' : 'bg-black/30 text-white border-white/20'}`} title="Medieval">
            <Crown size={20} />
          </button>
          <button onClick={() => setTheme('futuristic')} className={`p-2 rounded-full backdrop-blur-md border transition-all ${currentTheme === 'futuristic' ? 'bg-future-neon text-white border-future-neon shadow-[0_0_10px_#d946ef]' : 'bg-black/30 text-white border-white/20'}`} title="Futurístico">
            <Cpu size={20} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Tagline */}
        <span className={`inline-block py-1 px-3 rounded-full text-sm font-bold mb-6 animate-fade-in border
          ${currentTheme === 'glacial' ? 'bg-glacial-light/10 text-glacial-accent border-glacial-accent/50' : 
            currentTheme === 'medieval' ? 'bg-medieval-paper/10 text-medieval-accent border-medieval-accent/50 font-serif tracking-widest' : 
            currentTheme === 'futuristic' ? 'bg-future-cyan/10 text-future-cyan border-future-cyan/50 font-mono' :
            'bg-accent/20 text-accent border-accent/30'}`}
        >
          {content.tagline}
        </span>
        
        {/* Headline */}
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight animate-slide-up
          ${currentTheme === 'glacial' ? 'font-display tracking-wide drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 
            currentTheme === 'medieval' ? 'font-medieval tracking-normal text-medieval-paper drop-shadow-lg' : 
            currentTheme === 'futuristic' ? 'font-future uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]' :
            'font-display'}`}
        >
          {currentTheme === 'default' ? (
             <>DESCUBRA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-glacial-accent via-white to-future-neon">NOVOS MUNDOS</span></>
          ) : content.headline}
        </h1>
        
        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up delay-200
          ${currentTheme === 'glacial' ? 'text-glacial-light font-light' : 
            currentTheme === 'medieval' ? 'text-medieval-paper/80 font-serif italic' : 
            currentTheme === 'futuristic' ? 'text-future-cyan font-mono' :
            'text-slate-200'}`}
        >
          {content.sub}
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center animate-slide-up delay-300">
          <Button size="lg" onClick={onOpenTickets}>
            {currentTheme === 'medieval' ? 'Garantir Vaga' : currentTheme === 'futuristic' ? 'Acessar Sistema' : 'Garantir Ingressos'}
          </Button>
          <Button size="lg" variant="outline" onClick={scrollToEras}>
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