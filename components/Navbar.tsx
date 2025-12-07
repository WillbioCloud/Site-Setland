import React, { useState, useEffect } from 'react';
import { Menu, X, Facebook, Instagram } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenTickets: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTickets }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'O Parque', href: '#hero' },
    { name: '3 Eras', href: '#eras' },
    { name: 'Atrações', href: '#atracoes' },
    { name: 'Alimentação', href: '#menu' },
    { name: 'Contato', href: '#contato' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic Styles
  const bgClass = isScrolled 
    ? (currentTheme === 'glacial' ? 'bg-glacial-base/90 border-b border-glacial-accent/20' : 
       currentTheme === 'medieval' ? 'bg-medieval-base/95 border-b border-medieval-accent/20' : 
       currentTheme === 'futuristic' ? 'bg-black/90 border-b border-future-neon/50 shadow-[0_0_10px_rgba(217,70,239,0.2)]' : 
       'bg-slate-900/95') 
    : 'bg-transparent';

  const logoColor = 
    currentTheme === 'glacial' ? 'text-glacial-accent' : 
    currentTheme === 'medieval' ? 'text-medieval-accent' : 
    currentTheme === 'futuristic' ? 'text-future-neon' : 
    'text-accent';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-sm ${bgClass} ${isScrolled ? 'py-3 shadow-lg' : 'py-6'}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('#hero')}>
          <div className={`text-2xl font-black tracking-tighter text-white ${currentTheme === 'medieval' ? 'font-medieval' : currentTheme === 'futuristic' ? 'font-future italic' : 'font-display'}`}>
            SET<span className={logoColor}>LAND</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => scrollTo(link.href)}
              className={`text-sm font-semibold transition-colors uppercase tracking-wide relative group
                ${currentTheme === 'medieval' ? 'font-medieval text-medieval-paper hover:text-medieval-accent' : 
                  currentTheme === 'futuristic' ? 'font-mono text-future-cyan hover:text-white' : 
                  'text-slate-300 hover:text-white'}
              `}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full
                 ${currentTheme === 'glacial' ? 'bg-glacial-accent' : 
                   currentTheme === 'medieval' ? 'bg-medieval-accent' : 
                   currentTheme === 'futuristic' ? 'bg-future-neon' : 
                   'bg-accent'}
              `}></span>
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className={`flex gap-2 ${currentTheme === 'medieval' ? 'text-medieval-paper' : 'text-slate-400'}`}>
             <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
             <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
          </div>
          <Button size="sm" onClick={onOpenTickets}>
            {currentTheme === 'futuristic' ? 'GET_ACCESS' : 'Ingressos'}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full p-6 flex flex-col gap-4 shadow-xl animate-fade-in border-t border-slate-700
          ${currentTheme === 'glacial' ? 'bg-glacial-base' : 
            currentTheme === 'medieval' ? 'bg-medieval-base' : 
            currentTheme === 'futuristic' ? 'bg-black' : 
            'bg-slate-900'}
        `}>
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => scrollTo(link.href)}
              className="text-left text-lg font-semibold text-slate-300 hover:text-white py-2 border-b border-slate-800"
            >
              {link.name}
            </button>
          ))}
          <Button fullWidth onClick={() => { setMobileMenuOpen(false); onOpenTickets(); }}>
            Comprar Ingresso
          </Button>
        </div>
      )}
    </header>
  );
};