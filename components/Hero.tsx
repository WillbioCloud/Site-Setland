import React, { useState } from 'react';
import { Button } from './Button';
import { ChevronDown, Snowflake, Crown, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
          video: 'https://cdn.coverr.co/videos/coverr-flying-over-snowy-mountains-2849/1080p.mp4',
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
          image: '../assets/castelo-bg.jpg',
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

      {/* Theme Switcher - Reposicionado e Vertical */}
      <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-30 flex flex-col items-center gap-4 bg-black/20 p-3 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 py-2">
          Temas
        </span>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setTheme('glacial')} 
            className={`p-3 rounded-full transition-all duration-300 shadow-lg group relative
              ${currentTheme === 'glacial' ? 'bg-cyan-400 text-slate-900 scale-125 ring-4 ring-cyan-400/30' : 'bg-slate-700 text-cyan-400 hover:bg-cyan-950 hover:scale-110'}
            `} 
            title="Era Glacial"
          >
            <Snowflake size={24} />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Era Glacial
            </span>
          </button>

          <button 
            onClick={() => setTheme('medieval')} 
            className={`p-3 rounded-full transition-all duration-300 shadow-lg group relative
              ${currentTheme === 'medieval' ? 'bg-amber-500 text-amber-950 scale-125 ring-4 ring-amber-500/30' : 'bg-slate-700 text-amber-500 hover:bg-amber-950 hover:scale-110'}
            `} 
            title="Era Medieval"
          >
            <Crown size={24} />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Era Medieval
            </span>
          </button>

          <button 
            onClick={() => setTheme('futuristic')} 
            className={`p-3 rounded-full transition-all duration-300 shadow-lg group relative
              ${currentTheme === 'futuristic' ? 'bg-fuchsia-500 text-white scale-125 ring-4 ring-fuchsia-500/30' : 'bg-slate-700 text-fuchsia-500 hover:bg-fuchsia-950 hover:scale-110'}
            `} 
            title="Era Futurística"
          >
            <Cpu size={24} />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Era Futurística
            </span>
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
