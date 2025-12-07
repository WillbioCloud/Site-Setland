import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Snowflake, Shield, Zap, X, ArrowRight, Clock, Star, MapPin, Play, Ticket } from 'lucide-react';
import { ThemeEra } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

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
    description: 'Enfrente o frio extremo e criaturas pré-históricas.',
    longDescription: 'Mergulhe em um mundo onde a temperatura cai drasticamente e gigantes do passado caminham entre nós. A Era Glacial do SetLand não é apenas neve cenográfica; é uma experiência sensorial completa com ventos gelados, arquitetura de cristal e a emocionante Montanha Russa Blizzard.',
    details: ['Montanha Russa Blizzard', 'Show de Patinação', 'Hotel Iglu'],
    image: 'https://picsum.photos/seed/ice-bg/1200/600',
    color: 'bg-glacial-base',
    textColor: 'text-glacial-accent',
    buttonColor: 'bg-glacial-accent text-slate-900',
    rating: 4.8,
    duration: '3-4 horas',
    galleryImages: [
      'https://picsum.photos/seed/ice1/600/400',
      'https://picsum.photos/seed/ice2/600/400',
      'https://picsum.photos/seed/ice3/600/400',
    ],
    attractionsList: [
      { name: 'Pico da Nevasca', type: 'Radical', image: 'https://picsum.photos/seed/ice-attr1/300/200' },
      { name: 'Vila Pinguim', type: 'Infantil', image: 'https://picsum.photos/seed/ice-attr2/300/200' },
      { name: 'Mamute Animatronic', type: 'Show', image: 'https://picsum.photos/seed/ice-attr3/300/200' },
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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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
      // Allow animation to complete before removing animation lock (if needed)
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    // Find the current card to animate back to
    const el = expandedEraId ? cardRefs.current.get(expandedEraId) : null;
    if (el) {
        const rect = el.getBoundingClientRect();
        setActiveRect(rect); // Update rect for reverse animation destination
    }
    
    // Slight delay to allow state update to trigger close animation logic in modal
    setTimeout(() => {
      setExpandedEraId(null);
      setTheme('default');
      setIsAnimating(false);
    }, 500); // Wait for transition
  }, [expandedEraId, setTheme]);

  const handleNextEra = useCallback(() => {
    if (!expandedEraId) return;
    const currentIndex = erasData.findIndex(e => e.id === expandedEraId);
    const nextIndex = (currentIndex + 1) % erasData.length;
    const nextEra = erasData[nextIndex];

    // Close current
    handleClose();

    // Small delay to allow close animation to start, then trigger next open
    // This is the "chained" transition
    setTimeout(() => {
        handleCardClick(nextEra);
    }, 600);
  }, [expandedEraId, handleClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = expandedEraId ? 'hidden' : '';
  }, [expandedEraId]);

  // Keyboard trap & shortcuts
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
              className={`group relative h-48 md:h-64 w-full rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-[1.02]
                ${expandedEraId === era.id ? 'opacity-0' : 'opacity-100'} 
              `}
              aria-expanded={expandedEraId === era.id}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={era.image} 
                  alt={era.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${era.color.replace('bg-', 'from-')} to-transparent opacity-80`}></div>
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
        ${era.id === 'glacial' ? 'bg-slate-900/90 backdrop-blur-xl' : 
          era.id === 'medieval' ? 'bg-[#2a1b15] parchment-texture' : 
          'bg-black cyber-grid'}
    `;

    return (
        <div 
            style={style} 
            className={`${containerClasses} flex flex-col shadow-2xl`}
            role="dialog"
            aria-modal="true"
        >
            {/* Background Effects */}
            {era.id === 'glacial' && (
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
            )}

            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                autoFocus
            >
                <X size={32} />
            </button>

            {/* Content Container - Only visible after expansion starts */}
            <div className={`flex-1 overflow-y-auto no-scrollbar relative transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                
                {/* Hero Banner inside Modal */}
                <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                    <img 
                        src={era.image} 
                        alt={era.title} 
                        className={`w-full h-full object-cover 
                            ${era.id === 'glacial' ? 'animate-frost-reveal' : 'animate-fade-in'}
                        `}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-black/50 backdrop-blur-sm border border-white/10 ${era.textColor}`}>
                            {era.icon}
                            {era.subtitle}
                        </div>
                        <h1 className={`text-5xl md:text-8xl font-bold text-white mb-4 leading-none
                            ${era.id === 'glacial' ? 'font-display animate-frost-break' : 
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
                                ${era.id === 'glacial' ? 'text-blue-100 font-light' : 
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
                                        <div key={idx} className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors border border-white/10 group">
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
                                            className="h-48 rounded-lg snap-center shadow-lg hover:scale-[1.02] transition-transform" 
                                            alt="Gallery" 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Actions */}
                        <div className="space-y-6">
                            <div className={`p-6 rounded-2xl border ${era.id === 'medieval' ? 'bg-[#5c4033]/10 border-[#5c4033]/20' : 'bg-white/5 border-white/10'}`}>
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
