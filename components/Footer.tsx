import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../context/ThemeContext';

// Importação das Logos
import logoDefault from '../assets/logo-setland.png';
import logoMedieval from '../assets/logo-medieval.png';
import logoGlacial from '../assets/logo-glacial.png';
import logoFuturistic from '../assets/logo-futuristica.png';

export const Footer: React.FC = () => {
  const { currentTheme } = useTheme();

  // Define qual logo usar baseada no tema
  const getLogo = () => {
    switch (currentTheme) {
      case 'medieval': return logoMedieval;
      case 'glacial': return logoGlacial;
      case 'futuristic': return logoFuturistic;
      default: return logoDefault;
    }
  };

  return (
    <footer id="contato" className="bg-slate-900 pt-20 border-t border-slate-800 transition-colors duration-500">
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            {/* Logo Dinâmica */}
            <div className="mb-6">
              <img 
                src={getLogo()} 
                alt="SetLand Parque Temático" 
                className={`h-14 md:h-16 object-contain transition-all duration-500
                  ${currentTheme === 'glacial' ? 'drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : ''}
                  ${currentTheme === 'futuristic' ? 'drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]' : ''}
                `}
              />
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              O maior complexo de entretenimento temático do centro-oeste. Venha viver momentos inesquecíveis com sua família.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-accent hover:text-slate-900 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-accent hover:text-slate-900 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Navegação</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#hero" className="hover:text-accent transition-colors">Início</a></li>
              <li><a href="#eras" className="hover:text-accent transition-colors">3 Eras</a></li>
              <li><a href="#atracoes" className="hover:text-accent transition-colors">Atrações</a></li>
              <li><a href="/cardapio" className="hover:text-accent transition-colors">Alimentação</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Contato</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-accent shrink-0" size={18} />
                <span>Av. das Nações, 1000 - Solar de Caldas, Caldas Novas - GO</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-accent shrink-0" size={18} />
                <span>(64) 3453-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-accent shrink-0" size={18} />
                <span>contato@setland.com.br</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button size="sm" variant="outline" fullWidth>
                Falar no WhatsApp
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="h-64 md:h-auto rounded-xl overflow-hidden bg-slate-800 relative border border-slate-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.908679313464!2d-48.635833!3d-17.739722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQ0JzIzLjAiUyA0OMKwMzgnMDkuMCJX!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy"
              title="Mapa SetLand"
              className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="bg-slate-950 py-6 text-center text-slate-600 text-xs border-t border-slate-800">
        © {new Date().getFullYear()} SetLand Parque Temático. Todos os direitos reservados.
      </div>
    </footer>
  );
};