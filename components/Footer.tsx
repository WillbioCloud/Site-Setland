import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Button } from './Button';

export const Footer: React.FC = () => {
  return (
    <footer id="contato" className="bg-slate-900 pt-20 border-t border-slate-800">
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-display font-black tracking-tighter text-white mb-6">
              SET<span className="text-accent">LAND</span>
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
              <li><a href="#hero" className="hover:text-accent">Início</a></li>
              <li><a href="#eras" className="hover:text-accent">3 Eras</a></li>
              <li><a href="#atracoes" className="hover:text-accent">Atrações</a></li>
              <li><a href="#menu" className="hover:text-accent">Alimentação</a></li>
              <li><a href="#" className="hover:text-accent">Política de Privacidade</a></li>
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
          <div className="h-64 md:h-auto rounded-xl overflow-hidden bg-slate-800 relative">
            <iframe 
              src="https://maps.google.com/maps?q=Rua%20Presidente%20Get%C3%BAlio%20Vargas%20Quadra%2063%20Lagoa%20Quente%2C%20Caldas%20Novas&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy"
              title="Mapa SetLand"
              className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="bg-slate-950 py-6 text-center text-slate-600 text-xs">
        &copy; {new Date().getFullYear()} SetLand Parque Temático. Todos os direitos reservados.
      </div>
    </footer>
  );
};