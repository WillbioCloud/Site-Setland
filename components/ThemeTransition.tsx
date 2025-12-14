import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

// Importação das Logos
import logoDefault from '../assets/logo-setland.png';
import logoMedieval from '../assets/logo-medieval.png';
import logoGlacial from '../assets/logo-glacial.png';
import logoFuturistic from '../assets/logo-futuristica.png';

export const ThemeTransition: React.FC = () => {
  const { currentTheme } = useTheme();
  
  const prevThemeRef = useRef(currentTheme);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stage, setStage] = useState<'idle' | 'swap' | 'move'>('idle');

  const getLogo = (theme: string) => {
    switch (theme) {
      case 'medieval': return logoMedieval;
      case 'glacial': return logoGlacial;
      case 'futuristic': return logoFuturistic;
      default: return logoDefault;
    }
  };

  useEffect(() => {
    if (prevThemeRef.current !== currentTheme) {
      setIsAnimating(true);
      setStage('idle');
      
      // 1. Troca a logo no centro (Fade in/out)
      setTimeout(() => setStage('swap'), 100);

      // 2. Move para a posição da Navbar e remove o blur
      setTimeout(() => setStage('move'), 1200);

      // 3. Finaliza e limpa o componente
      setTimeout(() => {
        setIsAnimating(false);
        setStage('idle');
        prevThemeRef.current = currentTheme;
      }, 2000);
    }
  }, [currentTheme]);

  if (!isAnimating) return null;

  const oldLogo = getLogo(prevThemeRef.current);
  const newLogo = getLogo(currentTheme);

  return (
    <div className={`fixed inset-0 z-[100] pointer-events-none flex flex-col transition-all duration-700
      ${stage === 'move' ? 'backdrop-blur-0 bg-black/0' : 'backdrop-blur-xl bg-slate-900/60'}
    `}>
      
      {/* Container Estrutural (Espelho da Navbar) */}
      <div className="container mx-auto px-4 h-full relative">
        
        {/* Wrapper da Logo que Anima */}
        <div className={`absolute transition-all duration-700 ease-in-out
          ${stage === 'move' 
            ? 'top-4 left-4 transform translate-x-0 translate-y-0 scale-100' // Posição Final (Navbar)
            : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[2.5]' // Posição Inicial (Centro)
          }
        `}>
          
          <div className="relative">
            {/* Logo Antiga (Saindo) */}
            <img 
              src={oldLogo} 
              alt="Old Theme" 
              className={`h-12 md:h-16 object-contain absolute inset-0 m-auto transition-opacity duration-500
                ${stage === 'swap' || stage === 'move' ? 'opacity-0' : 'opacity-100'}
              `}
            />

            {/* Logo Nova (Entrando e Movendo) */}
            <img 
              src={newLogo} 
              alt="New Theme" 
              className={`h-12 md:h-16 object-contain relative z-10 transition-opacity duration-500
                ${stage === 'swap' || stage === 'move' ? 'opacity-100' : 'opacity-0'}
                ${currentTheme === 'glacial' ? 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]' : ''}
                ${currentTheme === 'futuristic' ? 'drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]' : ''}
              `}
            />
          </div>
        </div>

      </div>

      {/* Texto de Loading (Apenas decorativo no centro) */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-24 text-white font-bold tracking-[0.2em] uppercase text-sm transition-opacity duration-300
         ${stage === 'move' ? 'opacity-0' : 'opacity-80 animate-pulse'}
      `}>
        {currentTheme === 'futuristic' ? 'SYSTEM_REBOOT...' : 
         currentTheme === 'glacial' ? 'CONGELANDO...' : 
         currentTheme === 'medieval' ? 'VIAJANDO NO TEMPO...' : 'CARREGANDO...'}
      </div>

    </div>
  );
};