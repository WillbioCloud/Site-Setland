import React, { useState } from 'react';
import { Button } from './Button';
import { ChevronDown, Snowflake, Crown, Cpu, Zap, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Importação das Imagens dos Assets
import medievalBg from '../assets/castelo-bg.jpg';
import glacialCastle from '../assets/fundo-castelo.jpg';
import glacialOverlay from '../assets/blue-background.jpg';

interface HeroProps {
  onOpenTickets: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTickets }) => {
  const { currentTheme, setTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Efeito Parallax para Medieval/Futurista
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

  return (
    <section 
      id="hero" 
      className="relative h-screen flex items-center justify-center overflow-hidden transition-colors duration-700 bg-slate-900"
      onMouseMove={handleMouseMove}
    >
      {/* --- CAMADA DE FUNDO (BACKGROUNDS) --- */}
      <div className="absolute inset-0 z-0 opacity-90 overflow-hidden">
        
        {/* 1. TEMA GLACIAL (Castelo + Overlay Azul) */}
        {currentTheme === 'glacial' ? (
           <>
             {/* Imagem do Castelo Base */}
             <div className="absolute inset-0">
                <img 
                  src={glacialCastle} 
                  alt="Castelo de Gelo" 
                  className="w-full h-full object-cover filter brightness-90 contrast-110 hue-rotate-[10deg]"
                />
             </div>

             {/* Background Azul por cima (Overlay) */}
             <div className="absolute inset-0 opacity-110 mix-blend-overlay">
                <img 
                  src={glacialOverlay} 
                  alt="Textura de Gelo" 
                  className="w-full h-full object-cover"
                />
             </div>

             {/* Gradiente para leitura do texto */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#e0f7fa] via-white/10 to-transparent mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/20 to-cyan-900/60"></div>
             
             {/* Efeito de Neve Caindo (CSS Puro) */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/snow.png')] opacity-30 animate-pulse"></div>
           </>

        /* 2. TEMA MEDIEVAL */
        ) : currentTheme === 'medieval' ? (
          <>
            <img 
              src={medievalBg} 
              alt="Castelo Medieval" 
              className="w-full h-full object-cover sepia-[0.3] scale-105"
              style={{ transform: `scale(1.1) translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a1b15] via-[#2a1b15]/60 to-transparent"></div>
          </>

        /* 3. TEMA FUTURISTA */
        ) : currentTheme === 'futuristic' ? (
          <div className="w-full h-full bg-black relative">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_90%)]"></div>
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></div>
          </div>

        /* 4. PADRÃO */
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
        )}
      </div>

      {/* --- SELETOR DE TEMAS (BOTÕES LATERAIS) --- */}
      <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-30 flex flex-col items-center gap-4 bg-black/20 p-3 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 py-2">
          Temas
        </span>
        <div className="flex flex-col gap-4">
          
          {/* Botão Glacial */}
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

          {/* Botão Medieval */}
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

          {/* Botão Futurista */}
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