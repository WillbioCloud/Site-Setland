import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const highlights = [
  { 
    id: '1', 
    name: 'Picanha na Chapa', 
    description: 'Picanha grill, pão de alho, arroz branco e feijão tropeiro.', 
    price: 'R$ 67,77', 
    imageUrl: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?q=80&w=600'
  },
  { 
    id: '2', 
    name: 'Filé Mignon Kids', 
    description: 'Tiras grelhadas macias com arroz soltinho e batatas fritas.', 
    price: 'R$ 37,77', 
    imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=600'
  },
  { 
    id: '3', 
    name: 'Mignon à Parmegiana', 
    description: 'Filé mignon empanado crocante, arroz branco e legumes na manteiga.', 
    price: 'R$ 57,77', 
    imageUrl: '../assets/mignon-parmegiana.jpg'
  },
  { 
    id: '4', 
    name: 'Suco Natural', 
    description: 'Laranja, Abacaxi, Morango ou Limão. 400ml de puro frescor.', 
    price: 'R$ 10,77', 
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600' 
  },
];

export const MenuHighlights: React.FC = () => {
  return (
    <section id="menu" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-display font-black text-white mb-6">
             Destaques da <span className="text-accent">Cozinha</span>
           </h2>
           <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
             Sabores épicos para repor suas energias entre uma era e outra.
           </p>
        </div>
             
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
           {highlights.map((item) => (
             <div key={item.id} className="flex gap-4 items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-accent transition-colors group">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-white text-lg">{item.name}</h4>
                    <span className="text-accent font-bold bg-accent/10 px-2 py-1 rounded text-sm">{item.price}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{item.description}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="text-center mt-12">
            <Link to="/cardapio" className="inline-flex items-center gap-2 text-white font-bold hover:text-accent transition-colors group text-lg">
                Ver Cardápio Completo <ArrowRight size={20} className="transform group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>
      </div>
    </section>
  );
};