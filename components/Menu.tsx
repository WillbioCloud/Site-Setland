import React from 'react';
import { MenuItem } from '../types';

const menuItems: MenuItem[] = [
  { id: '1', name: 'Burger Medieval', description: 'Hambúrguer artesanal 180g assado na brasa, queijo cheddar.', price: 34.90, category: 'refeicoes', imageUrl: 'https://picsum.photos/seed/burger/200/200' },
  { id: '2', name: 'Sorvete Glacial', description: 'Sorvete de baunilha azul com cristais de açúcar.', price: 12.00, category: 'lanches', imageUrl: 'https://picsum.photos/seed/icecream/200/200' },
  { id: '3', name: 'Drink Neon', description: 'Limonada suíça com xarope de violeta (sem álcool).', price: 18.00, category: 'bebidas', imageUrl: 'https://picsum.photos/seed/drink/200/200' },
  { id: '4', name: 'Batata Rústica', description: 'Batatas cortadas com casca, alecrim e sal grosso.', price: 22.00, category: 'lanches', imageUrl: 'https://picsum.photos/seed/fries/200/200' },
];

export const MenuSection: React.FC = () => {
  return (
    <section id="menu" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
             <h2 className="text-4xl font-display font-black text-white mb-6">
               Sabores de <span className="text-accent">Outro Mundo</span>
             </h2>
             <p className="text-slate-400 mb-8">
               Nossa praça de alimentação temática oferece desde banquetes medievais fartos até lanches rápidos e futuristas. Opções para toda a família.
             </p>
             
             <div className="grid grid-cols-1 gap-6">
               {menuItems.map((item) => (
                 <div key={item.id} className="flex gap-4 items-center bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-white text-lg">{item.name}</h4>
                        <span className="text-accent font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-accent rounded-3xl rotate-6 opacity-20 blur-xl"></div>
            <img 
              src="https://picsum.photos/seed/restaurant/600/800" 
              alt="Praça de Alimentação" 
              className="relative rounded-3xl shadow-2xl border-4 border-slate-800"
            />
          </div>
        </div>
      </div>
    </section>
  );
};