import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const { currentTheme } = useTheme();

  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  // Theme-agnostic sizes
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const getThemeStyles = () => {
    // Futuristic
    if (currentTheme === 'futuristic') {
        // Updated syntax for arbitrary clip-path values
        const shape = "[clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)] rounded-none";
        
        if (variant === 'primary') return `bg-future-neon text-white hover:bg-fuchsia-600 shadow-[0_0_15px_rgba(217,70,239,0.5)] border border-transparent font-future tracking-wider uppercase ${shape}`;
        if (variant === 'outline') return `bg-transparent border border-future-cyan text-future-cyan hover:bg-future-cyan/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] font-future tracking-wider uppercase ${shape}`;
        return `text-slate-300 hover:text-white`;
    }
    
    // Medieval
    if (currentTheme === 'medieval') {
        const shape = "rounded-md";
        if (variant === 'primary') return `bg-medieval-accent text-medieval-base hover:brightness-110 shadow-lg border-2 border-[#5c4033] font-medieval tracking-widest ${shape}`;
        if (variant === 'outline') return `bg-transparent border-2 border-medieval-paper text-medieval-paper hover:bg-medieval-paper hover:text-medieval-base font-medieval tracking-widest ${shape}`;
        return `text-medieval-paper hover:text-white`;
    }

    // Glacial
    if (currentTheme === 'glacial') {
        const shape = "rounded-2xl";
        if (variant === 'primary') return `bg-glacial-accent text-slate-900 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] ${shape}`;
        if (variant === 'outline') return `bg-white/10 backdrop-blur-sm border border-white/40 text-white hover:bg-white/20 ${shape}`;
        return `text-glacial-light hover:text-white`;
    }

    // Default
    if (variant === 'primary') return "bg-accent hover:bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] rounded-lg";
    if (variant === 'secondary') return "bg-white text-slate-900 hover:bg-gray-100 rounded-lg";
    if (variant === 'outline') return "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white rounded-lg";
    return "text-slate-300 hover:text-white hover:bg-white/5 rounded-lg";
  };

  return (
    <button 
      className={`${baseStyles} ${getThemeStyles()} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};