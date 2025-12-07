import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Snowflake, Shield, Zap, X, ArrowRight, Clock, Star, MapPin, Play, Ticket } from 'lucide-react';
import { ThemeEra } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

// --- Helper Component: Snow Effect ---
const SnowOverlay = () => {
  // Cria flocos de neve aleatórios
  const flakes = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 5 + 5}s`,
    animationDelay: `${Math.random() * 5}s`,
    size: `${Math.random() * 1.5 + 0.5}rem`,
    opacity: Math.random() * 0.5 + 0.3
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white animate-fall"
          style={{
            left: flake.left,
            top: '-10%',
            fontSize: flake.size,
            opacity: flake.opacity,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }}
        >
          ❄
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

// --- Rich Data Structures ---

interface AttractionPreview {
  name: string;
  type: string;
  image: string;
}

interface EraData {
  id: ThemeEra;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  longDescription: string;
  details: string[];
  image: string;
  color: string;
  textColor: string;
  buttonColor: string;
  // New Rich Fields
  rating: number;
  duration: string;
  videoUrl?: string;
  galleryImages: string[];
  attractionsList: AttractionPreview[];
}

const erasData: EraData[] = [
  {
    id: 'glacial',
    title: 'Era Glacial',
    subtitle: 'O Reino de Gelo',
    icon: <Snowflake className="w-8 h-8" />,
    description: 'Enfrente -17°C e esculturas de gelo reais.',
    longDescription: 'O Parque de Gelo do Castelo Setland é uma das atrações mais frias e emocionantes do parque temático. Com uma temperatura média de 17 graus Celsius abaixo de zero, é um verdadeiro desafio para aqueles que procuram aventura e diversão. Lá dentro, os visitantes podem explorar esculturas de gelo incríveis e até um escorregador. Além disso, é possível experimentar a sensação de neve e gelo, algo raro na região do centro-oeste brasileiro. Para aqueles que se aventuram no Parque de Gelo, o Castelo Setland oferece casacos higienizados todos os dias e, para recuperar as energias, um delicioso chocolate quente para se aquecer.',
    details: ['Temperatura de -17°C', 'Esculturas de Gelo', 'Casacos Higienizados Inclusos'],
    image: 'https://picsum.photos/seed/ice-bg/1200/600',
    color: 'bg-glacial-base',
    textColor: 'text-glacial-accent',
    buttonColor: 'bg-glacial-accent text-slate-900',
    rating: 4.9,
    duration: 'Tempo Livre',
    galleryImages: [
      'https://picsum.photos/seed/ice1/600/400',
      'https://picsum.photos/seed/ice2/600/400',
      'https://picsum.photos/seed/ice3/600/400',
    ],
    attractionsList: [
      { name: 'Escorregador de Gelo', type: 'Radical', image: 'https://picsum.photos/seed/ice-attr1/300/200' },
      { name: 'Esculturas Cristal', type: 'Exposição', image: 'https://picsum.photos/seed/ice-attr2/300/200' },
      { name: 'Iglu Bar', type: 'Alimentação', image: 'https://picsum.photos/seed/ice-attr3/300/200' },
    ]
  },
  {
    id: 'medieval',
    title: 'Era Medieval',
    subtitle: 'Honra e Glória',
    icon: <Shield className="w-8 h-8" />,
    description: 'Cavaleiros, castelos e banquetes reais.',
    longDescription: 'Atravesse as muralhas de pedra e entre em Valória. Aqui, o aço encontra a magia. Testemunhe duelos reais na arena principal, participe de um banquete no Grande Salão e teste sua coragem nas masmorras do Dragão. Uma viagem no tempo autêntica e visceral.',
    details: ['Duelo de Cavaleiros', 'Banquete Real', 'Catapulta Humana'],
    image: 'https://picsum.photos/seed/medieval-bg/1200/600',
    color: 'bg-medieval-base',
    textColor: 'text-medieval-accent',
    buttonColor: 'bg-medieval-accent text-medieval-base',
    rating: 4.9,
    duration: '4-5 horas',
    galleryImages: [
      'https://picsum.photos/seed/med1/600/400',
      'https://picsum.photos/seed/med2/600/400',
      'https://picsum.photos/seed/med3/600/400',
    ],
    attractionsList: [
      { name: 'Arena de Justa', type: 'Show', image: 'https://picsum.photos/seed/med-attr1/300/200' },
      { name: 'Torre do Dragão', type: 'Radical', image: 'https://picsum.photos/seed/med-attr2/300/200' },
      { name: 'Feira da Vila', type: 'Lazer', image: 'https://picsum.photos/seed/med-attr3/300/200' },
    ]
  },
  {
    id: 'futuristic',
    title: 'Era Futurística',
    subtitle: 'Neon Future',
    icon: <Zap className="w-8 h-8" />,
    description: 'Tecnologia avançada e desafios neon.',
    longDescription: 'Bem-vindo ao ano 3000. Neo-SetLand é uma metrópole vibrante de luzes e sons. Experimente a gravidade zero, corra em pistas de luz com realidade aumentada e interaja com IAs que controlam a cidade. O futuro é brilhante, rápido e perigoso.',
    details: ['Cyber Race', 'Elevador Orbital', 'Arena Laser Tag'],
    image: 'https://picsum.photos/seed/future-bg/1200/600',
    color: 'bg-future-base',
    textColor: 'text-future-neon',
    buttonColor: 'bg-future-neon text-white',
    rating: 4.7,
    duration: '3 horas',
    galleryImages: [
      'https://picsum.photos/seed/fut1/600/400',
      'https://picsum.photos/seed/fut2/600/400',
      'https://picsum.photos/seed/fut3/600/400',
    ],
    attractionsList: [
      { name: 'Cyber Kart VR', type: 'Radical', image: 'https://picsum.photos/seed/fut-attr1/300/200' },
      { name: 'Laboratório X', type: 'Interativo', image: 'https://picsum.photos/seed/fut-attr2/300/200' },
      { name: 'Sky Net', type: 'Infantil', image: 'https://picsum.photos/seed/fut-attr3/300/200' },
    ]
  },
];

// --- Main Component ---

export const Eras: React.FC = () => {
  const [expandedEraId, setExpandedEraId] = useState<ThemeEra | null>(null);
  const [activeRect, setActiveRect] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { setTheme } = useTheme();
  const cardRefs = useRef<Map<ThemeEra, HTMLDivElement>>(new Map());

  const activeEraData = erasData.find(e => e.id === expandedEraId);

  // --- Interaction Handlers ---

  const handleCardClick = (era: EraData) => {
    if (isAnimating) return;
    const el = cardRefs.current.get(era.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      setActiveRect(rect);
      setExpandedEraId(era.id);
      setTheme(era.id);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    const el = expandedEraId ? cardRefs.current.get(expandedEraId) : null;
    if (el) {
        const rect = el.getBoundingClientRect();
        setActiveRect(rect);
    }
    
    setTimeout(() => {
      setExpandedEraId(null);
      setTheme('default');
      setIsAnimating(false);
    }, 500);
  }, [expandedEraId, setTheme]);

  const handleNextEra = useCallback(() => {
    if (!expandedEraId) return;
    const currentIndex = erasData.findIndex(e => e.id === expandedEraId);
    const nextIndex = (currentIndex + 1) % erasData.length;
    const nextEra = erasData[nextIndex];

    handleClose();

    setTimeout(() => {
        handleCardClick(nextEra);
    }, 600);
  }, [expandedEraId, handleClose]);

  useEffect(() => {
    document.body.style.overflow = expandedEraId ? 'hidden' : '';
  }, [expandedEraId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!expandedEraId) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNextEra();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedEraId, handleClose, handleNextEra]);

  return (
    <section id="eras" className="py-20 bg-slate-950 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-black text-white text-center mb-12 animate-fade-in">
          Escolha sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-500 to-fuchsia-500">Dimensão</span>
        </h2>

        {/* Card Stack */}
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {erasData.map((era) => (
            <div
              key={era.id}
              ref={(el) => { if (el) cardRefs.current.set(era.id, el); }}
              onClick={() => handleCardClick(era)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(era); }}
              className={`group relative h-48 md:h-64 w-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 shadow-lg hover:scale-[1.02]
                ${expandedEraId === era.id ? 'opacity-0' : 'opacity-100'} 
                ${era.id === 'glacial' 
                    ? 'border-2 border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]' 
                    : 'border border-white/10 hover:border-white/30 hover:shadow-2xl'}
              `}
              aria-expanded={expandedEraId === era.id}
            >
              {/* Card Snow Effect (Mini) */}
              {era.id === 'glacial' && (
                 <div className="absolute inset-0 z-20 pointer-events-none opacity-50">
                    <div className="absolute top-2 left-10 text-white animate-pulse">❄</div>
                    <div className="absolute top-10 right-20 text-white animate-pulse delay-700">❄</div>
                    <div className="absolute bottom-5 left-1/2 text-white animate-pulse delay-300">❄</div>
                 </div>
              )}

              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={era.image} 
                  alt={era.title}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40
                    ${era.id === 'glacial' ? 'opacity-70 filter brightness-125 saturate-50' : 'opacity-60'}
                  `}
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${era.color.replace('bg-', 'from-')} to-transparent opacity-80`}></div>
                {/* Icy Overlay for Glacial */}
                {era.id === 'glacial' && <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay"></div>}
              </div>

              {/* Card Content */}
              <div className="absolute inset-0 p-8 flex items-center justify-between">
                <div className="flex flex-col justify-center h-full max-w-xl z-10">
                  <div className={`flex items-center gap-3 mb-2 ${era.textColor} drop-shadow-md`}>
                    {era.icon}
                    <span className="font-bold tracking-widest uppercase text-sm">{era.subtitle}</span>
                  </div>
                  <h3 className={`text-3xl md:text-5xl font-bold text-white mb-2
                     ${era.id === 'medieval' ? 'font-medieval' : era.id === 'futuristic' ? 'font-future uppercase' : 'font-display'}
                     ${era.id === 'glacial' ? 'drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : ''}
                  `}>
                    {era.title}
                  </h3>
                  <p className="text-slate-200 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {era.description}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-10 group-hover:translate-x-0 ${era.buttonColor.split(' ')[0]} bg-opacity-20 backdrop-blur-sm`}>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPANDED MODAL (FLIP Animation) */}
      {expandedEraId && activeEraData && activeRect && (
        <EraModal 
            era={activeEraData} 
            initialRect={activeRect} 
            onClose={handleClose} 
            onNext={handleNextEra} 
        />
      )}
    </section>
  );
};

// --- Modal Component with Animations ---

interface EraModalProps {
    era: EraData;
    initialRect: DOMRect;
    onClose: () => void;
    onNext: () => void;
}

const EraModal: React.FC<EraModalProps> = ({ era, initialRect, onClose, onNext }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showContent, setShowContent] = useState(false);
    
    // Animation Styles State
    const [style, setStyle] = useState<React.CSSProperties>({
        position: 'fixed',
        top: initialRect.top,
        left: initialRect.left,
        width: initialRect.width,
        height: initialRect.height,
        borderRadius: '1.5rem', // 24px (rounded-3xl)
        zIndex: 50,
        transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        overflow: 'hidden',
    });

    // FLIP: Play
    useLayoutEffect(() => {
        // Force reflow
        requestAnimationFrame(() => {
            setStyle(prev => ({
                ...prev,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '0',
            }));
            setIsExpanded(true);
        });

        const timer = setTimeout(() => {
            setShowContent(true);
        }, 400); // Start showing content slightly before expansion ends

        return () => clearTimeout(timer);
    }, []);

    // Theme Specific Classes
    const containerClasses = `
        ${era.id === 'glacial' ? 'bg-slate-900/95 backdrop-blur-xl border-4 border-cyan-500/30' : 
          era.id === 'medieval' ? 'bg-[#2a1b15] parchment-texture' : 
          'bg-black cyber-grid'}
    `;

    return (
        <div 
            style={style} 
            className={`${containerClasses} flex flex-col shadow-2xl relative`}
            role="dialog"
            aria-modal="true"
        >
            {/* Background Effects - Snowfall for Glacial */}
            {era.id === 'glacial' && <SnowOverlay />}

            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white border border-white/10"
                autoFocus
            >
                <X size={32} />
            </button>

            {/* Content Container - Only visible after expansion starts */}
            <div className={`flex-1 overflow-y-auto no-scrollbar relative transition-opacity duration-500 z-40 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                
                {/* Hero Banner inside Modal */}
                <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                    <img 
                        src={era.image} 
                        alt={era.title} 
                        className={`w-full h-full object-cover 
                            ${era.id === 'glacial' ? 'animate-frost-reveal filter brightness-110 saturate-50' : 'animate-fade-in'}
                        `}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    {/* Extra Frost Overlay on Image */}
                    {era.id === 'glacial' && <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>}
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-black/50 backdrop-blur-sm border border-white/10 ${era.textColor}`}>
                            {era.icon}
                            {era.subtitle}
                        </div>
                        <h1 className={`text-5xl md:text-8xl font-bold text-white mb-4 leading-none
                            ${era.id === 'glacial' ? 'font-display animate-frost-break drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]' : 
                              era.id === 'medieval' ? 'font-medieval' : 'font-future uppercase'}
                        `}>
                            {era.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-white/80 text-sm font-semibold">
                            <span className="flex items-center gap-2"><Clock size={16} className={era.textColor} /> {era.duration}</span>
                            <span className="flex items-center gap-2"><Star size={16} className="text-yellow-400" /> {era.rating} / 5.0</span>
                            <span className="flex items-center gap-2"><MapPin size={16} className={era.textColor} /> Área Norte</span>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        
                        {/* Main Description */}
                        <div className="lg:col-span-2 space-y-8">
                            <p className={`text-xl leading-relaxed
                                ${era.id === 'glacial' ? 'text-cyan-50 font-light drop-shadow-sm' : 
                                  era.id === 'medieval' ? 'text-[#5c4033] font-serif' : 
                                  'text-slate-300 font-mono'}
                            `}>
                                {era.longDescription}
                            </p>

                            {/* Attractions List Mini-Cards */}
                            <div>
                                <h3 className={`text-2xl font-bold mb-6 ${era.id === 'medieval' ? 'text-[#5c4033]' : 'text-white'}`}>Atrações Principais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {era.attractionsList.map((attr, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors border border-white/10 group backdrop-blur-sm">
                                            <div className="h-32 overflow-hidden">
                                                <img src={attr.image} alt={attr.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="p-4">
                                                <span className={`text-xs font-bold uppercase ${era.textColor}`}>{attr.type}</span>
                                                <h4 className={`font-bold mt-1 ${era.id === 'medieval' ? 'text-[#2a1b15]' : 'text-white'}`}>{attr.name}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gallery Scroll */}
                            <div>
                                <h3 className={`text-2xl font-bold mb-6 ${era.id === 'medieval' ? 'text-[#5c4033]' : 'text-white'}`}>Galeria</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                                    {era.galleryImages.map((img, idx) => (
                                        <img 
                                            key={idx} 
                                            src={img} 
                                            className="h-48 rounded-lg snap-center shadow-lg hover:scale-[1.02] transition-transform border border-white/10" 
                                            alt="Gallery" 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Actions */}
                        <div className="space-y-6">
                            <div className={`p-6 rounded-2xl border backdrop-blur-md ${era.id === 'medieval' ? 'bg-[#5c4033]/10 border-[#5c4033]/20' : 'bg-white/5 border-white/10'}`}>
                                <h3 className={`text-xl font-bold mb-4 ${era.id === 'medieval' ? 'text-[#5c4033]' : 'text-white'}`}>Planeje sua visita</h3>
                                <ul className="space-y-3 mb-6">
                                    {era.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm opacity-80">
                                            <div className={`mt-1 w-1.5 h-1.5 rounded-full ${era.buttonColor.split(' ')[0]}`}></div>
                                            <span className={era.id === 'medieval' ? 'text-[#2a1b15]' : 'text-slate-300'}>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button fullWidth className="mb-3 flex items-center justify-center gap-2">
                                    <Ticket size={18} /> Comprar Ingresso
                                </Button>
                                <button className={`w-full py-3 rounded-lg border flex items-center justify-center gap-2 transition-colors
                                    ${era.id === 'medieval' ? 'border-[#5c4033] text-[#5c4033] hover:bg-[#5c4033]/10' : 'border-white/20 text-white hover:bg-white/10'}
                                `}>
                                    <Play size={18} /> Ver Vídeo
                                </button>
                            </div>

                            {/* Navigation */}
                            <button 
                                onClick={onNext}
                                className="w-full group p-6 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-500 transition-all text-left relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <span className="text-xs text-slate-400 uppercase tracking-widest">Próxima Parada</span>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xl font-bold text-white">Explorar Próxima Era</span>
                                        <ArrowRight className="text-white transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r ${era.color.replace('bg-', 'from-')} to-transparent`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};