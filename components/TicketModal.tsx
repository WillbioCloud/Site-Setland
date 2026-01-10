import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Users, CreditCard, CheckCircle, 
  Ticket, Shield, Zap, Snowflake, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [tickets, setTickets] = useState({ adult: 1, child: 0, senior: 0 });
  const { currentTheme } = useTheme();

  // Resetar estado ao abrir
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTickets({ adult: 1, child: 0, senior: 0 });
      setDate('');
      // Bloqueia scroll do body quando modal abre no mobile
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; }
  }, [isOpen]);

  if (!isOpen) return null;

  // Preços
  const PRICES = { adult: 89.90, child: 44.90, senior: 44.90 };
  const total = (tickets.adult * PRICES.adult) + (tickets.child * PRICES.child) + (tickets.senior * PRICES.senior);

  // --- Lógica de Temas ---
  const getThemeContent = () => {
    switch (currentTheme) {
      case 'futuristic':
        return {
          bgOverlay: 'bg-black/90 backdrop-blur-xl',
          modalBg: 'bg-black border-2 border-[#00f3ff] shadow-[0_0_50px_rgba(0,243,255,0.3)]',
          text: 'text-white font-future',
          accent: 'text-[#00f3ff]',
          accentBg: 'bg-[#00f3ff]',
          border: 'border-[#00f3ff]',
          title: 'TERMINAL', // Encurtei para caber melhor no mobile
          subtitle: 'Selecione ciclo de visita.',
          labels: { adult: 'HUMANO', child: 'MINI', senior: 'VETERANO' }, // Encurtei labels
          currency: 'CRÉDITOS',
          icon: <Zap size={24} className="text-[#00f3ff]" />,
          buttonClass: 'bg-[#00f3ff] text-black hover:bg-white hover:text-black font-future uppercase tracking-widest clip-path-slant',
          inputClass: 'bg-black border border-[#00f3ff] text-[#00f3ff] font-mono focus:shadow-[0_0_15px_#00f3ff]'
        };
      case 'medieval':
        return {
          bgOverlay: 'bg-black/80 backdrop-blur-sm',
          modalBg: 'bg-[#f5e6d3] border-4 double border-[#5c4033] shadow-2xl parchment-texture',
          text: 'text-[#4a3728] font-medieval',
          accent: 'text-[#800000]',
          accentBg: 'bg-[#800000]',
          border: 'border-[#5c4033]',
          title: 'Tesouro Real',
          subtitle: 'Salvo-conduto.',
          labels: { adult: 'Nobre', child: 'Escudeiro', senior: 'Sábio' },
          currency: 'OURO',
          icon: <Shield size={24} className="text-[#800000]" />,
          buttonClass: 'bg-[#800000] text-[#f5e6d3] hover:bg-[#5c4033] font-medieval border-2 border-[#5c4033] shadow-lg',
          inputClass: 'bg-[#eaddcf] border-b-2 border-[#5c4033] text-[#4a3728] font-serif focus:bg-[#dcc8b6]'
        };
      case 'glacial':
        return {
          bgOverlay: 'bg-[#0f172a]/80 backdrop-blur-md',
          modalBg: 'bg-[#e0f7fa] border border-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.4)]', // Tirei backdrop-blur do bg interno p/ mobile
          text: 'text-cyan-900 font-display',
          accent: 'text-cyan-600',
          accentBg: 'bg-cyan-500',
          border: 'border-cyan-300',
          title: 'Expedição',
          subtitle: 'Entrada no gelo.',
          labels: { adult: 'Explorador', child: 'Pinguim', senior: 'Veterano' },
          currency: 'BRL',
          icon: <Snowflake size={24} className="text-cyan-500" />,
          buttonClass: 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-md rounded-xl',
          inputClass: 'bg-white border border-cyan-200 text-cyan-900 focus:ring-2 focus:ring-cyan-400 rounded-lg'
        };
      default:
        return {
          bgOverlay: 'bg-slate-900/90 backdrop-blur-sm',
          modalBg: 'bg-slate-800 border border-slate-700 shadow-2xl',
          text: 'text-white font-sans',
          accent: 'text-accent',
          accentBg: 'bg-accent',
          border: 'border-slate-600',
          title: 'Bilheteria',
          subtitle: 'Seus ingressos.',
          labels: { adult: 'Adulto', child: 'Infantil', senior: 'Sênior' },
          currency: 'R$',
          icon: <Ticket size={24} className="text-accent" />,
          buttonClass: 'bg-accent text-slate-900 hover:bg-yellow-400 font-bold rounded-lg',
          inputClass: 'bg-slate-700 border border-slate-600 text-white rounded-lg focus:border-accent'
        };
    }
  };

  const theme = getThemeContent();

  return (
    // MUDANÇA: p-0 no mobile para ocupar tela toda
    <div className={`fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 ${theme.bgOverlay} transition-all duration-500`}>
      
      {/* Container Principal */}
      {/* MUDANÇA: h-full w-full para mobile (Fullscreen), rounded-none no mobile */}
      <div className={`w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] flex flex-col md:flex-row overflow-hidden relative animate-slide-up 
        ${theme.modalBg} 
        ${currentTheme === 'futuristic' ? 'rounded-none' : 'rounded-none md:rounded-3xl'}`
      }>
        
        {/* Decorativos (apenas desktop para economizar espaço visual no mobile) */}
        {currentTheme === 'futuristic' && (
            <>
                <div className="hidden md:block absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#00f3ff] rounded-tl-3xl opacity-50 pointer-events-none"></div>
                <div className="hidden md:block absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#00f3ff] rounded-br-3xl opacity-50 pointer-events-none"></div>
            </>
        )}

        {/* Botão Fechar - Maior e mais fácil de clicar no mobile */}
        <button 
          onClick={onClose}
          className={`absolute top-2 right-2 md:top-4 md:right-4 z-50 p-3 rounded-full transition-colors 
            ${currentTheme === 'futuristic' ? 'text-[#00f3ff] hover:bg-[#00f3ff]/20' : 
              currentTheme === 'medieval' ? 'text-[#800000] hover:bg-[#800000]/10' : 
              'text-slate-400 hover:bg-white/10 hover:text-white'}`}
        >
          <X size={28} />
        </button>

        {/* Lado Esquerdo: Resumo / Visual 
            MUDANÇA: No mobile, isso vira um Header compacto (shrink-0)
        */}
        <div className={`w-full md:w-1/3 p-5 md:p-8 flex flex-col justify-between relative shrink-0
            ${currentTheme === 'futuristic' ? 'bg-[#00f3ff]/5 md:border-r border-b md:border-b-0 border-[#00f3ff]/30' : 
              currentTheme === 'medieval' ? 'bg-[#eaddcf] md:border-r-2 border-b-2 md:border-b-0 border-[#5c4033] border-dashed' : 
              currentTheme === 'glacial' ? 'bg-cyan-50/50 border-b md:border-b-0 border-cyan-200' : 
              'bg-slate-900 md:border-r border-b md:border-b-0 border-slate-700'}`
        }>
            {/* Background Image (Desktop Only) */}
            <div className="hidden md:block absolute inset-0 opacity-10 pointer-events-none">
                <img 
                    src={currentTheme === 'medieval' ? "https://www.transparenttextures.com/patterns/wood-pattern.png" : ""} 
                    className="w-full h-full object-cover" 
                />
            </div>

            <div className="flex md:block items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-6">
                      {theme.icon}
                      <span className={`text-sm md:text-xl font-bold tracking-wider ${theme.text} opacity-80`}>SETLAND</span>
                  </div>
                  <h2 className={`text-2xl md:text-4xl font-bold leading-tight ${theme.text}`}>
                      {theme.title}
                  </h2>
                </div>
                
                {/* Visualizador de Total Compacto para Mobile (Cabeçalho) */}
                <div className="md:hidden text-right">
                    <p className={`text-xs opacity-70 ${theme.text}`}>Total</p>
                    <span className={`text-xl font-bold ${theme.accent}`}>
                      {total.toFixed(2)}
                    </span>
                </div>
            </div>
            
            <p className={`hidden md:block text-sm opacity-70 mb-8 ${theme.text}`}>
                {theme.subtitle}
            </p>

            {/* Resumo do Pedido (Mais detalhado no Desktop, oculto ou simplificado no Mobile Step 1) */}
            <div className={`hidden md:block p-4 rounded-xl space-y-3 
                ${currentTheme === 'futuristic' ? 'border border-[#00f3ff]/30 bg-black/50' : 
                  currentTheme === 'medieval' ? 'border border-[#5c4033]/30 bg-[#fffdf5]' : 
                  'bg-white/5 border border-white/10'}`
            }>
                <h3 className={`text-xs uppercase tracking-widest font-bold opacity-60 ${theme.text}`}>Resumo</h3>
                
                {date && (
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className={theme.accent} />
                        <span className={theme.text}>{new Date(date).toLocaleDateString('pt-BR')}</span>
                    </div>
                )}
                
                <div className="space-y-1">
                   {/* Lógica simples de resumo */}
                   <div className={`flex justify-between text-sm ${theme.text} opacity-80`}>
                      <span>{tickets.adult + tickets.child + tickets.senior} Ingressos</span>
                   </div>
                </div>

                <div className={`border-t pt-3 mt-2 flex justify-between items-end ${currentTheme === 'medieval' ? 'border-[#5c4033]/20' : 'border-white/20'}`}>
                    <span className={`text-sm ${theme.text}`}>Total</span>
                    <span className={`text-2xl font-bold ${theme.accent}`}>
                        {currentTheme === 'futuristic' ? 'C$ ' : 'R$ '}
                        {total.toFixed(2).replace('.', ',')}
                    </span>
                </div>
            </div>

            {/* Steps Indicator */}
            <div className="hidden md:flex gap-2 mt-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 
                        ${step >= i ? theme.accentBg : 'bg-gray-500/20'}`} 
                    />
                ))}
            </div>
        </div>

        {/* Lado Direito: Formulário */}
        {/* MUDANÇA: flex-1 para ocupar o resto da tela no mobile e overflow-y-auto para rolar apenas o conteúdo */}
        <div className="w-full md:w-2/3 flex-1 overflow-y-auto p-5 md:p-8 relative bg-transparent">
            
            {/* Steps Indicator Mobile (Topo do conteúdo) */}
            <div className="flex md:hidden gap-2 mb-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 
                        ${step >= i ? theme.accentBg : 'bg-current opacity-20'}`} 
                    />
                ))}
            </div>

            {/* STEP 1: Seleção */}
            {step === 1 && (
                <div className="space-y-6 md:space-y-8 animate-fade-in pb-20">
                    
                    {/* Seleção de Data */}
                    <div>
                        <label className={`block text-xs md:text-sm font-bold mb-3 uppercase tracking-wider ${theme.text}`}>
                            1. Escolha a Data
                        </label>
                        <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            // MUDANÇA: p-3 no mobile para touch target
                            className={`w-full p-3 md:p-4 outline-none transition-all rounded-lg appearance-none ${theme.inputClass}`}
                        />
                    </div>

                    {/* Seleção de Ingressos */}
                    <div>
                        <label className={`block text-xs md:text-sm font-bold mb-3 uppercase tracking-wider ${theme.text}`}>
                            2. Selecione os Ingressos
                        </label>
                        <div className="space-y-3 md:space-y-4">
                            {/* Adulto */}
                            <TicketCounter 
                                label={theme.labels.adult}
                                price={PRICES.adult}
                                value={tickets.adult}
                                onChange={(v) => setTickets({...tickets, adult: v})}
                                theme={theme}
                                currentTheme={currentTheme}
                            />
                            {/* Criança */}
                            <TicketCounter 
                                label={theme.labels.child}
                                subLabel="06-12 anos"
                                price={PRICES.child}
                                value={tickets.child}
                                onChange={(v) => setTickets({...tickets, child: v})}
                                theme={theme}
                                currentTheme={currentTheme}
                            />
                            {/* Senior */}
                            <TicketCounter 
                                label={theme.labels.senior}
                                subLabel="60+ anos"
                                price={PRICES.senior}
                                value={tickets.senior}
                                onChange={(v) => setTickets({...tickets, senior: v})}
                                theme={theme}
                                currentTheme={currentTheme}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={() => setStep(2)}
                            disabled={!date || total === 0}
                            className={`w-full py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base ${theme.buttonClass}`}
                        >
                            Continuar <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: Dados Pessoais */}
            {step === 2 && (
                <div className="space-y-6 animate-fade-in pb-20">
                    <button onClick={() => setStep(1)} className={`flex items-center gap-2 text-sm hover:underline mb-2 ${theme.text} opacity-60`}>
                        <ArrowLeft size={16} /> Voltar
                    </button>
                    
                    <h3 className={`text-xl md:text-2xl font-bold ${theme.text}`}>Quem vai embarcar?</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={`text-xs uppercase font-bold ${theme.text}`}>Nome Completo</label>
                            <input type="text" placeholder="Seu nome" className={`w-full p-3 outline-none rounded-lg ${theme.inputClass}`} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs uppercase font-bold ${theme.text}`}>E-mail</label>
                            <input type="email" inputMode="email" placeholder="seu@email.com" className={`w-full p-3 outline-none rounded-lg ${theme.inputClass}`} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs uppercase font-bold ${theme.text}`}>CPF</label>
                            <input type="tel" placeholder="000.000.000-00" className={`w-full p-3 outline-none rounded-lg ${theme.inputClass}`} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs uppercase font-bold ${theme.text}`}>Celular</label>
                            <input type="tel" placeholder="(00) 00000-0000" className={`w-full p-3 outline-none rounded-lg ${theme.inputClass}`} />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={() => setStep(3)}
                            className={`w-full py-4 flex items-center justify-center gap-2 transition-all text-sm md:text-base ${theme.buttonClass}`}
                        >
                            Ir para Pagamento <CreditCard size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: Pagamento */}
            {step === 3 && (
                <div className="space-y-6 animate-fade-in pb-20">
                    <button onClick={() => setStep(2)} className={`flex items-center gap-2 text-sm hover:underline mb-2 ${theme.text} opacity-60`}>
                        <ArrowLeft size={16} /> Voltar
                    </button>

                    <h3 className={`text-xl md:text-2xl font-bold ${theme.text}`}>Pagamento</h3>

                    <div className="space-y-3">
                        <button className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-95 ${theme.border} ${theme.text}`}>
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                <Zap size={20} />
                            </div>
                            <div className="text-left flex-1">
                                <div className="font-bold">PIX</div>
                                <div className="text-xs opacity-70">Aprovação Imediata</div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border ${theme.border}`}></div>
                        </button>

                        <button className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-95 ${theme.border} ${theme.text}`}>
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                                <CreditCard size={20} />
                            </div>
                            <div className="text-left flex-1">
                                <div className="font-bold">Cartão</div>
                                <div className="text-xs opacity-70">Até 3x sem juros</div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border ${theme.border}`}></div>
                        </button>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={() => setStep(4)}
                            className={`w-full py-4 flex items-center justify-center gap-2 transition-all text-sm md:text-base ${theme.buttonClass}`}
                        >
                            Confirmar Compra
                        </button>
                        <p className={`text-center text-xs mt-3 opacity-50 ${theme.text}`}>
                            Ambiente Seguro.
                        </p>
                    </div>
                </div>
            )}

            {/* STEP 4: Sucesso */}
            {step === 4 && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-slide-up pb-20">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 
                        ${currentTheme === 'futuristic' ? 'bg-[#00f3ff]/20 text-[#00f3ff]' : 
                          currentTheme === 'medieval' ? 'bg-[#800000]/20 text-[#800000]' : 
                          'bg-green-100 text-green-600'}`
                    }>
                        <CheckCircle size={40} className="md:w-12 md:h-12" />
                    </div>
                    <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme.text}`}>
                        {currentTheme === 'medieval' ? 'Glória ao Reino!' : 'Sucesso!'}
                    </h2>
                    <p className={`mb-8 max-w-xs mx-auto opacity-70 text-sm md:text-base ${theme.text}`}>
                        Seus ingressos foram enviados para seu e-mail.
                    </p>
                    <div className={`p-4 rounded-lg mb-8 font-mono text-lg tracking-widest border border-dashed ${theme.border} ${theme.text}`}>
                        #SL-{Math.floor(Math.random() * 99999)}
                    </div>
                    <button 
                        onClick={onClose}
                        className={`px-8 py-3 rounded-lg transition-all w-full md:w-auto ${theme.buttonClass}`}
                    >
                        Fechar
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

// Sub-componente para contador de ingressos (Ajustado tamanho mobile)
const TicketCounter: React.FC<{ 
    label: string, 
    subLabel?: string, 
    price: number, 
    value: number, 
    onChange: (val: number) => void,
    theme: any,
    currentTheme: string
}> = ({ label, subLabel, price, value, onChange, theme, currentTheme }) => (
    <div className={`flex items-center justify-between p-3 md:p-4 rounded-xl border transition-all
        ${currentTheme === 'futuristic' ? 'border-[#00f3ff]/30 hover:border-[#00f3ff]' : 
          currentTheme === 'medieval' ? 'border-[#5c4033]/30 hover:border-[#5c4033] bg-[#fffdf5]' : 
          'bg-white/5 border-white/10 hover:bg-white/10'}`
    }>
        <div>
            <div className={`font-bold text-sm md:text-base ${theme.text}`}>{label}</div>
            {subLabel && <div className={`text-[10px] md:text-xs opacity-60 ${theme.text}`}>{subLabel}</div>}
            <div className={`font-mono text-xs md:text-sm mt-1 ${theme.accent}`}>
                R$ {price.toFixed(2).replace('.', ',')}
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => onChange(Math.max(0, value - 1))}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors 
                    ${currentTheme === 'futuristic' ? 'border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black' : 
                      currentTheme === 'medieval' ? 'bg-[#5c4033] text-[#f5e6d3] hover:bg-[#800000]' : 
                      'bg-slate-700 text-white hover:bg-slate-600'}`}
            >
                -
            </button>
            <span className={`w-6 text-center font-bold ${theme.text}`}>{value}</span>
            <button 
                onClick={() => onChange(value + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors 
                    ${currentTheme === 'futuristic' ? 'bg-[#00f3ff] text-black hover:bg-white' : 
                      currentTheme === 'medieval' ? 'bg-[#800000] text-[#f5e6d3] hover:bg-[#5c4033]' : 
                      'bg-accent text-slate-900 hover:bg-yellow-400'}`}
            >
                +
            </button>
        </div>
    </div>
);