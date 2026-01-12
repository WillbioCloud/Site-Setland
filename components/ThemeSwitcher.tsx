import React, { useState, useEffect } from 'react';
import { Snowflake, Crown, Cpu, Palette, X, ChevronLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  const [isCompact, setIsCompact] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Controle de compacto no desktop
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // -----------------------
  //   MOBILE - Botão Explosivo com animação mais chiclete
  // -----------------------
  const MobileSwitcher = () => (
    <div className="md:hidden fixed top-[15%] right-2 z-[90] flex items-center justify-center">
      {/* Botões satélites */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Glacial */}
        <button
          onClick={() => {
            setTheme('glacial');
            setIsMobileOpen(false);
          }}
          className={`
            absolute w-11 h-11 rounded-full flex items-center justify-center shadow-xl
            transition-all duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1.2)]
            bg-cyan-900/90 border-2 border-cyan-400/70 text-cyan-300 z-40
            ${isMobileOpen
              ? '-translate-x-16 -translate-y-14 opacity-100 scale-100 rotate-0'
              : 'translate-x-2 translate-y-2 opacity-0 scale-0 -rotate-90'}
          `}
        >
          <Snowflake size={20} />
        </button>

        {/* Medieval */}
        <button
          onClick={() => {
            setTheme('medieval');
            setIsMobileOpen(false);
          }}
          className={`
            absolute w-11 h-11 rounded-full flex items-center justify-center shadow-xl
            transition-all duration-[680ms] ease-[cubic-bezier(0.34,1.56,0.64,1.2)]
            bg-[#2a1b15]/90 border-2 border-amber-500/70 text-amber-400 z-40
            ${isMobileOpen
              ? '-translate-x-20 translate-y-0 opacity-100 scale-100 rotate-0'
              : 'translate-x-1 translate-y-1 opacity-0 scale-0 -rotate-90'}
          `}
          style={{ transitionDelay: '40ms' }}
        >
          <Crown size={20} />
        </button>

        {/* Futurista */}
        <button
          onClick={() => {
            setTheme('futuristic');
            setIsMobileOpen(false);
          }}
          className={`
            absolute w-11 h-11 rounded-full flex items-center justify-center shadow-xl
            transition-all duration-[720ms] ease-[cubic-bezier(0.34,1.56,0.64,1.2)]
            bg-black/80 border-2 border-fuchsia-600/70 text-fuchsia-400 z-40
            ${isMobileOpen
              ? '-translate-x-16 translate-y-14 opacity-100 scale-100 rotate-0'
              : 'translate-x-3 translate-y-3 opacity-0 scale-0 -rotate-90'}
          `}
          style={{ transitionDelay: '80ms' }}
        >
          <Cpu size={20} />
        </button>
      </div>

      {/* Botão principal */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          shadow-2xl border-2 backdrop-blur-lg transition-all duration-400 active:scale-90
          ${
            isMobileOpen
              ? 'bg-slate-800 border-slate-600 text-white rotate-180'
              : currentTheme === 'glacial'
              ? 'bg-cyan-600/90 border-cyan-300 text-white shadow-[0_0_25px_rgba(34,211,238,0.6)]'
              : currentTheme === 'medieval'
              ? 'bg-amber-600/90 border-amber-300 text-white shadow-[0_0_25px_rgba(245,158,11,0.6)]'
              : currentTheme === 'futuristic'
              ? 'bg-fuchsia-700/90 border-fuchsia-400 text-white shadow-[0_0_25px_rgba(217,70,239,0.6)]'
              : 'bg-slate-700/90 border-slate-500 text-white'
          }
        `}
      >
        <div className={`transition-transform duration-400 ${isMobileOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isMobileOpen ? <X size={24} /> : <Palette size={24} />}
        </div>
      </button>
    </div>
  );

  // -----------------------
  //   DESKTOP - Painel lateral (mantido mais limpo, mas com animação suave)
  // -----------------------
  const DesktopSwitcher = () => {
    const showFull = !isCompact || isHovered;

    return (
      <div
        className={`
          hidden md:block fixed top-1/2 -translate-y-1/2 z-[90]
          transition-transform duration-500 ease-out
          ${showFull ? 'right-6' : 'right-0'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`
            flex flex-col items-center gap-5 p-4 shadow-2xl border backdrop-blur-xl
            transition-all duration-500 ease-out origin-right
            ${showFull
              ? 'w-20 rounded-3xl border-r translate-x-0'
              : 'w-14 rounded-l-3xl border-r-0 rounded-r-none translate-x-10'}
            ${
              currentTheme === 'futuristic'
                ? 'bg-black/40 border-[#00f3ff]/30'
                : currentTheme === 'medieval'
                ? 'bg-[#2a1b15]/60 border-[#8b5a2b]/40'
                : currentTheme === 'glacial'
                ? 'bg-slate-900/50 border-cyan-400/30'
                : 'bg-slate-900/50 border-white/20'
            }
          `}
        >
          <div
            className={`
              flex flex-col items-center gap-5 transition-opacity duration-400
              ${showFull ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}
            `}
          >
            {/* Botões */}
            {[
              { theme: 'glacial', icon: Snowflake, color: 'cyan', label: 'Glacial' },
              { theme: 'medieval', icon: Crown, color: 'amber', label: 'Medieval' },
              { theme: 'futuristic', icon: Cpu, color: 'fuchsia', label: 'Futurista' },
            ].map(({ theme, icon: Icon, color, label }) => (
              <button
                key={theme}
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(theme);
                }}
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    currentTheme === theme
                      ? `bg-${color}-500 text-white scale-110 shadow-lg shadow-${color}-500/50`
                      : `bg-white/10 text-${color}-400 hover:bg-${color}-500 hover:text-white hover:scale-110`
                  }
                `}
                title={label}
              >
                <Icon size={26} />
              </button>
            ))}
          </div>

          {/* Indicador */}
          <div className="flex flex-col items-center">
            {!showFull && (
              <ChevronLeft
                size={22}
                className={`animate-pulse mb-1 ${
                  currentTheme === 'glacial'
                    ? 'text-cyan-400'
                    : currentTheme === 'medieval'
                    ? 'text-amber-400'
                    : currentTheme === 'futuristic'
                    ? 'text-fuchsia-400'
                    : 'text-gray-400'
                }`}
              />
            )}
            <Palette size={22} className="opacity-60" />
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