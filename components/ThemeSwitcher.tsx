import React, { useState, useEffect } from 'react';
import { Snowflake, Crown, Cpu, Palette, X, ChevronLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  
  // --- ESTADOS ---
  const [isCompact, setIsCompact] = useState(false); // Para Desktop (scroll)
  const [isHovered, setIsHovered] = useState(false); // Para Desktop (hover)
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Para Mobile (clique)

  // Detecta rolagem (Apenas para lógica Desktop)
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- VERSÃO MOBILE (Botão Explosivo) ---
  const MobileSwitcher = () => (
    // MUDANÇA: top-[25%] conforme seu ajuste para ficar mais alto na tela
    <div className="md:hidden fixed top-[15%] right-1 z-[90] flex items-center justify-center">
      
      {/* Botões Satélites (Aparecem atrás do botão principal) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* 1. Glacial (Explode para Cima/Esquerda) */}
        <button
          onClick={() => { setTheme('glacial'); setIsMobileOpen(false); }}
          className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-spring pointer-events-auto
            bg-cyan-900 border border-cyan-400 text-cyan-400 z-40
            ${isMobileOpen 
              ? '-translate-x-12 -translate-y-10 opacity-100 scale-100 rotate-0' 
              : 'translate-x-0 translate-y-0 opacity-0 scale-0 rotate-90'
            }
          `}
        >
          <Snowflake size={18} />
        </button>

        {/* 2. Medieval (Explode para Esquerda) */}
        <button
          onClick={() => { setTheme('medieval'); setIsMobileOpen(false); }}
          style={{ transitionDelay: '50ms' }} // Pequeno atraso para efeito cascata
          className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-spring pointer-events-auto
            bg-[#2a1b15] border border-amber-500 text-amber-500 z-40
            ${isMobileOpen 
              ? '-translate-x-16 translate-y-0 opacity-100 scale-100 rotate-0' 
              : 'translate-x-0 translate-y-0 opacity-0 scale-0 rotate-90'
            }
          `}
        >
          <Crown size={18} />
        </button>

        {/* 3. Futurista (Explode para Baixo/Esquerda) */}
        <button
          onClick={() => { setTheme('futuristic'); setIsMobileOpen(false); }}
          style={{ transitionDelay: '100ms' }} // Pequeno atraso para efeito cascata
          className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-spring pointer-events-auto
            bg-black border border-fuchsia-500 text-fuchsia-500 z-40
            ${isMobileOpen 
              ? '-translate-x-12 translate-y-10 opacity-100 scale-100 rotate-0' 
              : 'translate-x-0 translate-y-0 opacity-0 scale-0 rotate-90'
            }
          `}
        >
          <Cpu size={18} />
        </button>
      </div>

      {/* Botão Principal Mobile (Gatilho) */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border backdrop-blur-md z-50 transition-all duration-300 active:scale-90
          ${isMobileOpen ? 'bg-slate-800 border-slate-600 text-white' : 
            currentTheme === 'glacial' ? 'bg-cyan-500 border-cyan-300 text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.5)]' :
            currentTheme === 'medieval' ? 'bg-amber-500 border-amber-300 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,0.5)]' :
            currentTheme === 'futuristic' ? 'bg-fuchsia-600 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.5)]' :
            'bg-slate-700 border-slate-500 text-white'
          }
        `}
      >
        <div className={`transition-transform duration-300 ${isMobileOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isMobileOpen ? <X size={20} /> : <Palette size={20} />}
        </div>
      </button>
    </div>
  );

  // --- VERSÃO DESKTOP (Painel Lateral Deslizante) ---
  const DesktopSwitcher = () => {
    // Lógica original: Mostra completo se NÃO for compacto OU se estiver com mouse em cima
    const showFull = !isCompact || isHovered;

    return (
      <div 
        className={`hidden md:flex fixed top-1/2 -translate-y-1/2 z-[90] transition-all duration-500 ease-in-out
          ${showFull 
            ? 'right-6 translate-x-0' // Visível e flutuando
            : 'right-0 translate-x-[calc(100%-3rem)]' // Recolhido na borda
          }
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`
          flex flex-col items-center gap-4 p-3 shadow-[0_0_30px_rgba(0,0,0,0.2)] border backdrop-blur-xl transition-all duration-500
          ${showFull ? 'rounded-full border-r' : 'rounded-l-2xl border-r-0 rounded-r-none'} 
          
          ${currentTheme === 'futuristic' ? 'bg-black/30 border-[#00f3ff]/40 shadow-[0_0_20px_rgba(0,243,255,0.15)]' : 
            currentTheme === 'medieval' ? 'bg-[#2a1b15]/50 border-[#5c4033]/50 shadow-[0_0_20px_rgba(92,64,51,0.3)]' : 
            currentTheme === 'glacial' ? 'bg-slate-900/30 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]' :
            'bg-slate-900/30 border-white/20'}
        `}>
          
          {/* Indicador (Seta ou Texto) */}
          <div className="flex flex-col items-center gap-2 pt-2">
              {/* Seta pulsante quando recolhido */}
              {!showFull && (
                  <ChevronLeft size={20} className={`animate-pulse mb-1 ${
                      currentTheme === 'glacial' ? 'text-cyan-400' : 
                      currentTheme === 'medieval' ? 'text-[#fbbf24]' : 
                      currentTheme === 'futuristic' ? 'text-[#ff00ff]' : 'text-white'
                  }`} />
              )}
              
              <div className={`transition-all duration-300 ${showFull ? 'opacity-100 rotate-0 h-auto' : 'opacity-60 -rotate-90 scale-75 h-6'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest block whitespace-nowrap drop-shadow-md select-none
                      ${currentTheme === 'glacial' ? 'text-cyan-200' : 
                      currentTheme === 'medieval' ? 'text-[#fbbf24]' : 
                      currentTheme === 'futuristic' ? 'text-[#00f3ff]' : 'text-white'}
                  `}>
                      {showFull ? <span className="text-[10px] opacity-70 mb-2 block text-center">TEMAS</span> : <Palette size={20}/>}
                  </span>
              </div>
          </div>

          {/* Lista de Botões Desktop */}
          <div className="flex flex-col gap-3 pb-2">
            
            {/* Glacial */}
            <button 
              onClick={(e) => { e.stopPropagation(); setTheme('glacial'); }} 
              className={`relative flex items-center justify-center transition-all duration-300 group
                ${showFull ? 'w-12 h-12 rounded-full' : 'w-8 h-8 rounded-full'}
                ${currentTheme === 'glacial' ? 'bg-cyan-400 text-slate-900 scale-110' : 'bg-white/10 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 hover:scale-110'}
              `} 
              title="Era Glacial"
            >
              <Snowflake size={showFull ? 24 : 16} />
              {showFull && (
                <span className="absolute right-full mr-4 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Glacial
                </span>
              )}
            </button>

            {/* Medieval */}
            <button 
              onClick={(e) => { e.stopPropagation(); setTheme('medieval'); }} 
              className={`relative flex items-center justify-center transition-all duration-300 group
                ${showFull ? 'w-12 h-12 rounded-full' : 'w-8 h-8 rounded-full'}
                ${currentTheme === 'medieval' ? 'bg-amber-500 text-amber-950 scale-110' : 'bg-white/10 text-amber-500 hover:bg-amber-500 hover:text-amber-950 hover:scale-110'}
              `} 
              title="Era Medieval"
            >
              <Crown size={showFull ? 24 : 16} />
              {showFull && (
                <span className="absolute right-full mr-4 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Medieval
                </span>
              )}
            </button>

            {/* Futurista */}
            <button 
              onClick={(e) => { e.stopPropagation(); setTheme('futuristic'); }} 
              className={`relative flex items-center justify-center transition-all duration-300 group
                ${showFull ? 'w-12 h-12 rounded-full' : 'w-8 h-8 rounded-full'}
                ${currentTheme === 'futuristic' ? 'bg-fuchsia-500 text-white scale-110' : 'bg-white/10 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white hover:scale-110'}
              `} 
              title="Era Futurística"
            >
              <Cpu size={showFull ? 24 : 16} />
              {showFull && (
                <span className="absolute right-full mr-4 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Futurista
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MobileSwitcher />
      <DesktopSwitcher />
    </>
  );
};