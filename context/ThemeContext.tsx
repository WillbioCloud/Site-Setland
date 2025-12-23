// willbiocloud/site-setland/Site-Setland-.../context/ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeEra } from '../types';

interface ThemeContextType {
  currentTheme: ThemeEra | 'default';
  setTheme: (theme: ThemeEra | 'default') => void;
  isChristmasMode: boolean; // Nova propriedade para saber se é Natal
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeEra | 'default'>('default');
  const [isChristmasMode, setIsChristmasMode] = useState(false);

  useEffect(() => {
    // LÓGICA DE DATA AUTOMÁTICA
    const checkSeasonalTheme = () => {
      const today = new Date();
      // Defina o intervalo do Natal (Ex: 01 de Dezembro a 06 de Janeiro)
      // Mês no JS começa em 0 (11 = Dezembro, 0 = Janeiro)
      
      const currentYear = today.getFullYear();
      const startChristmas = new Date(currentYear, 11, 1); // 01 Dez
      const endChristmas = new Date(currentYear, 11, 31);  // 31 Dez

      // Para testar AGORA, descomente a linha abaixo:
      // return true; 

      return today >= startChristmas && today <= endChristmas;
    };

    const isXmas = checkSeasonalTheme();
    setIsChristmasMode(isXmas);

    // Adiciona classe auxiliar no body para CSS global (bordas, cores, etc.) se quiser usar
    if (isXmas) {
      document.body.classList.add('christmas-mode');
    } else {
      document.body.classList.remove('christmas-mode');
    }
  }, []);

  useEffect(() => {
    // Remove classes antigas
    document.body.classList.remove('theme-glacial', 'theme-medieval', 'theme-futuristic');
    
    // Aplica o tema base escolhido
    if (currentTheme !== 'default') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, isChristmasMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};