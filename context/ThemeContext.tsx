import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeEra } from '../types';

export type SiteTheme = ThemeEra | 'default';
const THEME_KEY = 'setland:era';
const themes: SiteTheme[] = ['default', 'glacial', 'medieval', 'futuristic'];

interface ThemeContextType {
  currentTheme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  isChristmasMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<SiteTheme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return themes.includes(stored as SiteTheme) ? (stored as SiteTheme) : 'default';
    } catch {
      return 'default';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
    try {
      localStorage.setItem(THEME_KEY, currentTheme);
    } catch {
      /* Private browsing may block storage. */
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: setCurrentTheme,
        isChristmasMode: new Date().getMonth() === 11,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
