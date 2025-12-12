import React from 'react';
import { Hero } from '../components/Hero';
import { Eras } from '../components/Eras';
import { Attractions } from '../components/Attractions';
import { MenuHighlights } from '../components/MenuHighlights';

interface HomeProps {
  onOpenTickets: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenTickets }) => {
  return (
    <>
        <Hero onOpenTickets={onOpenTickets} />
        <Eras />
        <Attractions />
        
        {/* Reviews Section Placeholder */}
        <section className="py-20 bg-opacity-50 bg-slate-900 border-y border-slate-800 relative z-10 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-12">O que dizem os aventureiros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800/80 p-8 rounded-2xl relative border border-slate-700">
                  <div className="text-accent text-4xl absolute top-4 left-6">"</div>
                  <p className="text-slate-300 italic mb-6 relative z-10 pt-4">
                    "Simplesmente incrível! A área medieval parece um filme. Meus filhos amaram a área Glacial."
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-slate-600 rounded-full overflow-hidden">
                       <img src='{`https://picsum.photos/seed/user${i}/100/100`}' alt="User" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white text-sm">Maria Silva</div>
                      <div className="text-accent text-xs">★★★★★</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MenuHighlights />

        {/* FAQ Section */}
        <section className="py-20 bg-slate-900/90 relative z-10">
          <div className="container mx-auto px-4 max-w-3xl">
             <h2 className="text-3xl font-display font-bold text-center text-white mb-12">Dúvidas Frequentes</h2>
             <div className="space-y-4">
                {[
                  { q: "Qual o horário de funcionamento?", a: "Funcionamos de terça a domingo, das 09h às 18h." },
                  { q: "Crianças pagam ingresso?", a: "Crianças até 5 anos não pagam. De 6 a 12 anos pagam meia." },
                  { q: "Posso levar alimentos?", a: "Não é permitida a entrada de alimentos e bebidas, exceto papinhas infantis e dietas especiais." }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-slate-800/80 rounded-lg p-6 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700">
                    <h4 className="font-bold text-white mb-2">{faq.q}</h4>
                    <p className="text-slate-400 text-sm">{faq.a}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>
    </>
  );
};