import React, { useState } from 'react';
import { Attraction } from '../types';
import { useTheme } from '../context/ThemeContext';

const attractionsData: Attraction[] = [
  { id: '1', name: 'Parque de gelo', category: 'scenery', era: 'glacial', imageUrl: '../assets/Parque-de-Gelo.gif', description: 'Temperatura abaixo de -17°C.' },
  { id: '2', name: 'Playground', category: 'kids', era: 'glacial', imageUrl: '../assets/Playground.jpg', description: 'Uma miniatura do castelo de gelo.' },
  { id: '3', name: 'Vila medieval', category: 'scenery', era: 'medieval', imageUrl: '../assets/Vila-medieval.png', description: 'Cenário medieval com casa e artigos medieval.' },
  { id: '4', name: 'Catapulta Humana', category: 'radical', era: 'medieval', imageUrl: 'https://picsum.photos/seed/med2/400/300', description: 'Bungee jump reverso na torre do castelo.' },
  { id: '5', name: 'Cyber Race VR', category: 'radical', era: 'futuristic', imageUrl: 'https://picsum.photos/seed/fut1/400/300', description: 'Corrida de karts com realidade aumentada.' },
  { id: '6', name: 'Laboratório Neon', category: 'kids', era: 'futuristic', imageUrl: 'https://picsum.photos/seed/fut2/400/300', description: 'Experiências científicas divertidas para crianças.' },
];

export const Attractions: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'kids' | 'radical' | 'scenery'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { currentTheme } = useTheme();

  const filtered = filter === 'all' 
    ? attractionsData 
    : attractionsData.filter(a => a.category === filter);

  // Theme specific container styling
  const containerClass = 
    currentTheme === 'glacial' ? 'bg-glacial-base' : 
    currentTheme === 'medieval' ? 'bg-medieval-base' :
    currentTheme === 'futuristic' ? 'bg-future-base' :
    'bg-slate-900';

  const titleClass =
    currentTheme === 'glacial' ? 'text-white font-display' :
    currentTheme === 'medieval' ? 'text-medieval-accent font-medieval tracking-widest' :
    currentTheme === 'futuristic' ? 'text-future-neon font-future' :
    'text-white font-display';

  return (
    <section id="atracoes" className={`py-20 relative transition-colors duration-700 ${containerClass}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${titleClass}`}>
            {currentTheme === 'medieval' ? 'As Lendas do Reino' : 
             currentTheme === 'futuristic' ? 'SYSTEM_MODULES' : 
             'Nossas Atrações'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            De aventuras radicais a diversão para os pequenos. Escolha seu nível de adrenalina.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'kids', 'radical', 'scenery'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all
                ${filter === cat 
                  ? 'bg-accent text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
                ${currentTheme === 'glacial' && filter === cat ? '!bg-glacial-accent !text-glacial-base !shadow-[0_0_15px_rgba(34,211,238,0.4)]' : ''}
                ${currentTheme === 'medieval' && filter === cat ? '!bg-medieval-accent !text-medieval-base !font-medieval' : ''}
                ${currentTheme === 'futuristic' && filter === cat ? '!bg-transparent !border !border-future-neon !text-future-neon !shadow-[0_0_10px_#d946ef]' : ''}
              `}
            >
              {cat === 'all' ? 'Todas' : cat === 'scenery' ? 'Cenários' : cat === 'radical' ? 'Radicais' : 'Kids'}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((attraction) => (
            <div 
              key={attraction.id} 
              onMouseEnter={() => setHoveredId(attraction.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative overflow-hidden transition-all duration-500
                ${currentTheme === 'glacial' ? '[clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)] glass-panel hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 
                  currentTheme === 'medieval' ? 'rounded-lg bg-[#f5e6d3] border-4 border-[#5c4033] shadow-xl hover:-translate-y-2' : 
                  currentTheme === 'futuristic' ? 'rounded-none hologram-card' :
                  'rounded-2xl bg-slate-800 shadow-xl hover:-translate-y-2'}
              `}
            >
              {/* Image Container */}
              <div className={`w-full overflow-hidden relative
                 ${currentTheme === 'glacial' ? 'aspect-square m-1 w-[calc(100%-0.5rem)] [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]' : 'aspect-video'}
              `}>
                <img 
                  src={attraction.imageUrl} 
                  alt={attraction.name}
                  className={`w-full h-full object-cover transition-all duration-700
                    ${currentTheme === 'glacial' && hoveredId === attraction.id ? 'animate-frost-reveal blur-0 scale-100' : currentTheme === 'glacial' ? 'blur-[2px] scale-105' : ''}
                    ${currentTheme === 'medieval' ? 'grayscale-[0.3] group-hover:grayscale-0 sepia-[0.2]' : ''}
                    ${currentTheme === 'futuristic' ? 'opacity-80 group-hover:opacity-100 group-hover:scale-110' : 'group-hover:scale-110'}
                  `}
                  loading="lazy"
                />
                
                {/* Era Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide z-10
                  ${attraction.era === 'glacial' ? 'bg-glacial-accent text-slate-900' : 
                    attraction.era === 'medieval' ? 'bg-medieval-red text-white' : 
                    'bg-future-neon text-white'}`}
                >
                  {attraction.era}
                </div>

                {/* Futuristic HUD Overlay */}
                {currentTheme === 'futuristic' && hoveredId === attraction.id && (
                    <div className="absolute inset-0 border-2 border-future-cyan/50 p-4 flex flex-col justify-between animate-hologram pointer-events-none">
                        <div className="flex justify-between">
                            <span className="w-2 h-2 bg-future-cyan"></span>
                            <span className="w-2 h-2 bg-future-cyan"></span>
                        </div>
                        <div className="text-center text-future-cyan font-mono text-xs tracking-widest bg-black/50 backdrop-blur-sm p-1">
                            SCANNING...
                        </div>
                        <div className="flex justify-between">
                            <span className="w-2 h-2 bg-future-cyan"></span>
                            <span className="w-2 h-2 bg-future-cyan"></span>
                        </div>
                    </div>
                )}
              </div>

              {/* Content */}
              <div className={`p-6 relative z-10
                 ${currentTheme === 'glacial' ? 'text-white' : 
                   currentTheme === 'medieval' ? 'text-medieval-base bg-[#f5e6d3] bg-opacity-100 parchment-texture' : 
                   currentTheme === 'futuristic' ? 'bg-black/80 backdrop-blur-md' :
                   'bg-slate-800 text-white'}
                 ${currentTheme === 'medieval' && hoveredId === attraction.id ? 'animate-parchment' : ''}
              `}>
                <h3 className={`text-xl font-bold mb-2
                   ${currentTheme === 'glacial' ? 'font-display' : 
                     currentTheme === 'medieval' ? 'font-medieval text-2xl text-[#5c4033]' : 
                     currentTheme === 'futuristic' ? 'font-future text-future-cyan' :
                     'font-display'}
                `}>{attraction.name}</h3>
                
                <p className={`text-sm mb-4
                   ${currentTheme === 'glacial' ? 'text-glacial-light/80' : 
                     currentTheme === 'medieval' ? 'text-[#5c4033]/80 font-serif' : 
                     currentTheme === 'futuristic' ? 'text-slate-400 font-mono text-xs' :
                     'text-slate-400'}
                `}>{attraction.description}</p>
                
                <div className="flex items-center justify-between">
                   <span className="text-xs font-semibold uppercase tracking-widest opacity-70">{attraction.category}</span>
                   <button className={`text-sm font-bold hover:underline
                      ${currentTheme === 'glacial' ? 'text-glacial-accent' : 
                        currentTheme === 'medieval' ? 'text-medieval-red' : 
                        currentTheme === 'futuristic' ? 'text-future-neon' :
                        'text-accent'}
                   `}>
                     {currentTheme === 'futuristic' ? 'ACCESS_DATA >' : 'Detalhes &rarr;'}
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};