import React, { useState, useEffect } from 'react';
import { Menu, X, Facebook, Instagram } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Importação das Logos
import logoDefault from '../assets/logo-setland.png';
import logoMedieval from '../assets/logo-medieval.png';
import logoGlacial from '../assets/logo-glacial.png';
import logoFuturistic from '../assets/logo-futuristica.png';

interface NavbarProps {
  onOpenTickets: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTickets }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentTheme, setTheme } = useTheme();
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (target: string) => {
    setMobileMenuOpen(false);

    if (target.startsWith('#')) {
      if (location.pathname === '/') {
        if (target === '#hero') setTheme('default');
        const element = document.querySelector(target);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setTheme('default');
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(target);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(target);
      window.scrollTo(0, 0);
    }
  };

  // Define qual logo usar baseada no tema
  const getLogo = () => {
    switch (currentTheme) {
      case 'medieval': return logoMedieval;
      case 'glacial': return logoGlacial;
      case 'futuristic': return logoFuturistic;
      default: return logoDefault;
    }
  };

  // Dynamic Styles Background
  const bgClass = isScrolled 
    ? (currentTheme === 'glacial' ? 'bg-glacial-base/90 border-b border-glacial-accent/20' : 
       currentTheme === 'medieval' ? 'bg-medieval-base/95 border-b border-medieval-accent/20' : 
       currentTheme === 'futuristic' ? 'bg-black/90 border-b border-future-neon/50 shadow-[0_0_10px_rgba(217,70,239,0.2)]' : 
       'bg-slate-900/95') 
    : 'bg-transparent';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-sm ${bgClass} ${isScrolled ? 'py-2 shadow-lg' : 'py-4'}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* LOGO DINÂMICA (IMAGEM) */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('#hero')}>
          <img 
            src={getLogo()} 
            alt="SetLand Logo" 
            className={`transition-all duration-500 object-contain
              ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}
              ${currentTheme === 'glacial' ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''}
              ${currentTheme === 'futuristic' ? 'drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]' : ''}
            `}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => handleNavigation('#hero')} className="text-sm font-bold text-white hover:text-accent transition-colors uppercase tracking-wide drop-shadow-sm">O Parque</button>
          <button onClick={() => handleNavigation('#eras')} className="text-sm font-bold text-white hover:text-accent transition-colors uppercase tracking-wide drop-shadow-sm">3 Eras</button>
          <button onClick={() => handleNavigation('#atracoes')} className="text-sm font-bold text-white hover:text-accent transition-colors uppercase tracking-wide drop-shadow-sm">Atrações</button>
          <button onClick={() => handleNavigation('/cardapio')} className="text-sm font-bold text-white hover:text-accent transition-colors uppercase tracking-wide drop-shadow-sm">Cardápio</button>
          <button onClick={() => handleNavigation('#contato')} className="text-sm font-bold text-white hover:text-accent transition-colors uppercase tracking-wide drop-shadow-sm">Contato</button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className={`flex gap-2 ${currentTheme === 'medieval' ? 'text-medieval-paper' : 'text-white'}`}>
             <a href="#" className="hover:text-accent transition-colors drop-shadow-sm"><Instagram size={20} /></a>
             <a href="#" className="hover:text-accent transition-colors drop-shadow-sm"><Facebook size={20} /></a>
          </div>
          <Button size="sm" onClick={onOpenTickets}>
            {currentTheme === 'futuristic' ? 'GET_ACCESS' : 'Ingressos'}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white drop-shadow-md"
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
          <button onClick={() => handleNavigation('#hero')} className="text-left text-lg font-semibold text-slate-100 hover:text-white py-2 border-b border-white/10">O Parque</button>
          <button onClick={() => handleNavigation('#eras')} className="text-left text-lg font-semibold text-slate-100 hover:text-white py-2 border-b border-white/10">3 Eras</button>
          <button onClick={() => handleNavigation('#atracoes')} className="text-left text-lg font-semibold text-slate-100 hover:text-white py-2 border-b border-white/10">Atrações</button>
          <button onClick={() => handleNavigation('/cardapio')} className="text-left text-lg font-semibold text-slate-100 hover:text-white py-2 border-b border-white/10">Cardápio</button>
          <button onClick={() => handleNavigation('#contato')} className="text-left text-lg font-semibold text-slate-100 hover:text-white py-2 border-b border-white/10">Contato</button>
          
          <Button fullWidth onClick={() => { setMobileMenuOpen(false); onOpenTickets(); }}>
            Comprar Ingresso
          </Button>
        </div>
      )}
    </header>
  );
};