import React, { useState, useEffect } from 'react';
import { Snowflake, Crown, Cpu, Palette, ChevronLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isCompact, setIsCompact] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Detecta rolagem para encolher o menu automaticamente
  useEffect(() => {
    const handleScroll = () => {
      // Se rolar mais de 100px, entra no modo compacto
      setIsCompact(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define se deve mostrar a versão completa
  const showFull = !isCompact || isHovered;

  return (
    <div 
      className={`fixed top-1/2 -translate-y-1/2 z-[90] transition-all duration-500 ease-in-out
        ${showFull 
          ? 'right-6 translate-x-0' // Descolado da lateral (Flutuante)
          : 'right-0 translate-x-[calc(100%-3.5rem)]' // Colado na borda (Escondido)
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className={`
        flex flex-col items-center gap-4 p-3 shadow-[0_0_30px_rgba(0,0,0,0.2)] border backdrop-blur-xl transition-all duration-500
        ${showFull ? 'rounded-full border-r' : 'rounded-l-2xl border-r-0 rounded-r-none'} 
        
        ${/* Cores transparentes estilo "Vidro" */ ''}
        ${currentTheme === 'futuristic' ? 'bg-black/30 border-[#00f3ff]/40 shadow-[0_0_20px_rgba(0,243,255,0.15)]' : 
          currentTheme === 'medieval' ? 'bg-[#2a1b15]/50 border-[#5c4033]/50 shadow-[0_0_20px_rgba(92,64,51,0.3)]' : 
          currentTheme === 'glacial' ? 'bg-slate-900/30 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]' :
          'bg-slate-900/30 border-white/20'}
      `}>
        
        {/* Indicador de "Puxe" ou Título */}
        <div className="flex flex-col items-center gap-2 pt-2">
            {!showFull && (
                <ChevronLeft size={20} className={`animate-pulse mb-1 ${
                    currentTheme === 'glacial' ? 'text-cyan-400' : 
                    currentTheme === 'medieval' ? 'text-[#fbbf24]' : 
                    currentTheme === 'futuristic' ? 'text-[#ff00ff]' : 'text-white'
                }`} />
            )}
            
            {/* Texto "Temas" rotacionado */}
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

        {/* Botões de Seleção */}
        <div className="flex flex-col gap-3 pb-2">
          
          {/* Glacial */}
          <button 
            onClick={(e) => { e.stopPropagation(); setTheme('glacial'); }} 
            className={`relative flex items-center justify-center transition-all duration-300 group
              ${showFull ? 'w-12 h-12 rounded-full' : 'w-8 h-8 rounded-full'}
              ${currentTheme === 'glacial' ? 'bg-cyan-400 text-slate-900 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'bg-white/10 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 hover:scale-110'}
            `} 
            title="Era Glacial"
          >
            <Snowflake size={showFull ? 24 : 16} />
            {showFull && (
                <span className="absolute right-full mr-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                Era Glacial
                </span>
            )}
          </button>

          {/* Medieval */}
          <button 
            onClick={(e) => { e.stopPropagation(); setTheme('medieval'); }} 
            className={`relative flex items-center justify-center transition-all duration-300 group
              ${showFull ? 'w-12 h-12 rounded-full' : 'w-8 h-8 rounded-full'}
              ${currentTheme === 'medieval' ? 'bg-amber-500 text-amber-950 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-white/10 text-amber-500 hover:bg-amber-500 hover:text-amber-950 hover:scale-110'}
            `} 
            title="Era Medieval"
          >
            <Crown size={showFull ? 24 : 16} />
            {showFull && (
                <span className="absolute right-full mr-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                Era Medieval
                </span>
            )}
          </button>

          {/* Futurista */}
          <button 
            onClick={(e) => { e.stopPropagation(); setTheme('futuristic'); }} 
            className={`relative flex items-center justify-center transition-all duration-300 group
              ${showFull ? 'w-12 h-12 rounded-full' : 'w-8 h-8 rounded-full'}
              ${currentTheme === 'futuristic' ? 'bg-fuchsia-500 text-white scale-110 shadow-[0_0_15px_rgba(217,70,239,0.6)]' : 'bg-white/10 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white hover:scale-110'}
            `} 
            title="Era Futurística"
          >
            <Cpu size={showFull ? 24 : 16} />
            {showFull && (
                <span className="absolute right-full mr-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                Era Futurística
                </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};