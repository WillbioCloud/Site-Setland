import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeEra } from '../types';

interface ThemeContextType {
  currentTheme: ThemeEra | 'default';
  setTheme: (theme: ThemeEra | 'default') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeEra | 'default'>('default');

  useEffect(() => {
    // Clean up old theme classes
    document.body.classList.remove('theme-glacial', 'theme-medieval', 'theme-futuristic');
    
    // Apply new theme class to body for global styling overrides
    if (currentTheme !== 'default') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme }}>
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