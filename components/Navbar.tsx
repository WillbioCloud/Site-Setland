import React, { useState, useEffect } from 'react';
import { Menu, X, Facebook, Instagram } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
      // Se estamos na Home, rola até a seção
      if (location.pathname === '/') {
        if (target === '#hero') setTheme('default'); // Reseta tema se for para o topo
        const element = document.querySelector(target);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Se estamos em outra página (ex: /cardapio), vai para a home e depois rola
        setTheme('default');
        navigate('/');
        // Pequeno delay para a página carregar antes de rolar
        setTimeout(() => {
          const element = document.querySelector(target);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Navegação para outra página (ex: /cardapio)
      navigate(target);
      window.scrollTo(0, 0);
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
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('#hero')}>
          <div className={`text-2xl font-black tracking-tighter text-white drop-shadow-md ${currentTheme === 'medieval' ? 'font-medieval' : currentTheme === 'futuristic' ? 'font-future italic' : 'font-display'}`}>
            SET<span className={logoColor}>LAND</span>
          </div>
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