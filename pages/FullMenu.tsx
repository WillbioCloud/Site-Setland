import React, { useState, useEffect } from 'react';
import { Utensils, Pizza, Wine } from 'lucide-react';

// --- Dados do Cardápio Completo ---
interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  image: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    id: 'entradas',
    title: 'Entradas e Petiscos',
    icon: <Utensils size={18} />,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9674c96b?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'PÃO ÁZIMO', price: 'R$ 7,77', description: 'Com manteiga de erva e caponata de berinjela.' },
      { name: 'FRITAS SIMPLES', price: 'R$ 22,77' },
      { name: 'FRITAS COM QUEIJO', price: 'R$ 27,77' },
      { name: 'FRITAS ESPECIAIS', price: 'R$ 37,77', description: 'Com bacon e creme de cheddar.' },
      { name: 'PASTÉIS (6 UNID)', price: 'R$ 37,77', description: 'Carne e queijo.' },
      { name: 'QUIBE DE CUPIM (6 UNID)', price: 'R$ 47,77', description: 'Recheado com queijo.' },
      { name: 'SALADA CAESAR', price: 'R$ 47,77', description: 'Alface, croutons, frango, parmesão e molho especial.' },
      { name: 'QUEIJO COALHO (300g)', price: 'R$ 57,77', description: 'Grelhado com mel de abelha.' },
      { name: 'CEVICHE DE TILÁPIA', price: 'R$ 67,77', description: 'Pimenta, limão, salsa, cebola roxa e azeite.' },
      { name: 'TÁBUA DO MAR', price: 'R$ 137,77', description: 'Tilápia, camarões, brócolis, tomate cereja, alcaparras.' },
    ]
  },
  {
    id: 'hamburguer',
    title: 'Hambúrgueres',
    icon: <span className="text-lg">🍔</span>,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'BIG BURGUER FRANGO', price: 'R$ 27,77', description: 'Tirinhas de frango, peru, presunto, tomate, muçarela e fritas.' },
      { name: 'X-BURGUER', price: 'R$ 27,77', description: 'Hambúrguer, cebola caramelizada, picles, queijo coalho e fritas.' },
      { name: 'X-PICANHA', price: 'R$ 37,77', description: 'Hambúrguer de picanha, bacon, presunto, muçarela e fritas.' },
    ]
  },
  {
    id: 'pratos',
    title: 'Pratos Principais',
    icon: <Utensils size={18} />,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'FRANGO À PARMEGIANA', price: 'R$ 47,77', description: 'Empanado, arroz branco e legumes na manteiga.' },
      { name: 'FILÉ DE TILÁPIA REAL', price: 'R$ 57,77', description: 'Filé de tilápia, arroz branco e legumes na manteiga.' },
      { name: 'MIGNON À PARMEGIANA', price: 'R$ 57,77', description: 'Mignon empanado, arroz branco e legumes na manteiga.' },
      { name: 'PICANHA NA CHAPA', price: 'R$ 67,77', description: 'Picanha grill, pão de alho, arroz e feijão tropeiro.' },
      { name: 'BIFE ANCHO ANGUS', price: 'R$ 147,77', description: 'Legumes assados, abóbora, batata, banana e risoto.' },
      { name: 'T-BONE', price: 'R$ 147,77', description: 'Arroz de alho, farofa, legumes assados e vinagrete.' },
    ]
  },
  {
    id: 'panelinhas',
    title: 'Panelinhas',
    icon: <span className="text-lg">🥘</span>,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'GOIANA SETLAND', price: 'R$ 77,77', description: 'Arroz, frango, linguiça, guariroba, pequi, muçarela e banana. (2 pessoas)' },
      { name: 'MISTA', price: 'R$ 77,77', description: 'Mignon, frango, tomate, muçarela, parmesão. (2 pessoas)' },
      { name: 'DE CAMARÃO', price: 'R$ 157,77', description: 'Arroz, camarão, presunto, ervilha, pimentões, muçarela. (2 pessoas)' },
    ]
  },
  {
    id: 'pizzas',
    title: 'Pizzas Medievais',
    icon: <Pizza size={18} />,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'SETLAND', price: 'R$ 77,77', description: 'Cordeiro assado ao vinho, muçarela e pesto.' },
      { name: 'ARIEL', price: 'R$ 117,77', description: 'Camarão, champignon, palmito, alho poró e tomate seco.' },
      { name: 'PIRATA', price: 'R$ 67,77', description: 'Lombo canadense, muçarela, azeitona, queijo prato.' },
      { name: 'CARRASCO', price: 'R$ 67,77', description: 'Frango, guariroba, pequi, jiló, milho e pimentas.' },
      { name: 'VALENTE', price: 'R$ 57,77', description: 'Muçarela, calabresa, cebola e azeitona.' },
      { name: 'REI E RAINHA (DOCE)', price: 'R$ 67,77', description: 'Muçarela, chocolate, castanha de caju e cereja.' },
    ]
  },
  {
    id: 'drinks',
    title: 'Bebidas & Drinks',
    icon: <Wine size={18} />,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'CAIPIRINHA', price: 'R$ 15,77', description: 'Velho barreiro, limão, gelo e açúcar.' },
      { name: 'COQUETEL S/ ÁLCOOL', price: 'R$ 18,77', description: 'Frutas da estação.' },
      { name: 'GIN TANQUERAY', price: 'R$ 16,77', description: 'Dose.' },
      { name: 'HEINEKEN / PETRA (Long)', price: 'R$ 10,77' },
      { name: 'BRAHMA DUPLO (600ml)', price: 'R$ 14,77' },
      { name: 'ÁGUA COM GÁS', price: 'R$ 4,77' },
      { name: 'SUCO NATURAL', price: 'R$ 10,77', description: 'Laranja, Abacaxi, Morango ou Limão.' },
    ]
  }
];

export const FullMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('entradas');

  // Rola para o topo ao montar a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const element = document.getElementById(`cat-${catId}`);
    if (element) {
      // Ajuste o offset (150px) para compensar o header fixo
      const y = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-4">
            Banquetes <span className="text-accent">Reais</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            O verdadeiro sabor da realeza. Uma seleção gastronômica digna de cavaleiros, viajantes do tempo e exploradores glaciais.
          </p>
        </div>

        {/* Category Navigation (Sticky) */}
        <div className="sticky top-24 z-40 bg-slate-950/95 backdrop-blur-md py-4 mb-12 border-b border-slate-800 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:justify-center snap-x">
            {menuData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all snap-center
                  ${activeCategory === cat.id 
                    ? 'bg-accent text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-accent hover:text-white'}
                `}
              >
                {cat.icon}
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Content */}
        <div className="space-y-24">
          {menuData.map((category) => (
            <div key={category.id} id={`cat-${category.id}`} className="scroll-mt-48 animate-slide-up">
              
              <div className="flex flex-col md:flex-row gap-8 mb-8 items-end">
                 <div className="w-full md:w-1/3">
                    <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
                        <img 
                            src={category.image} 
                            alt={category.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <h3 className="absolute bottom-4 left-6 text-3xl font-display font-bold text-white drop-shadow-md">
                            {category.title}
                        </h3>
                    </div>
                 </div>
                 <div className="w-full md:w-2/3 pb-4">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-24"></div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {category.items.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-bold text-white text-lg tracking-wide group-hover:text-accent transition-colors">
                        {item.name}
                      </span>
                      
                      {/* Dotted Line */}
                      <div className="flex-1 mx-4 border-b-2 border-dotted border-slate-700 h-1 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      
                      <span className="font-bold text-accent text-lg whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-slate-500 text-sm font-light leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p className="mb-2">* Imagens meramente ilustrativas.</p>
            <p>Se beber, não dirija. Venda proibida para menores de 18 anos.</p>
            <p className="mt-4 text-accent/50 italic">Cobramos taxa de serviço de 10% (opcional).</p>
        </div>

      </div>
    </section>
  );
};