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
    }
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
          title: 'ACCESS_TERMINAL // V.4.0',
          subtitle: 'Selecione seu ciclo de visita.',
          labels: { adult: 'HUMANO [STD]', child: 'HUMANO [MINI]', senior: 'VETERANO' },
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
          title: 'O Tesouro Real',
          subtitle: 'Garanta seu salvo-conduto para o reino.',
          labels: { adult: 'Nobre (Inteira)', child: 'Mini Escudeiro (Meia)', senior: 'Sábio Ancião(Melhor Idade)' },
          currency: 'OURO',
          icon: <Shield size={24} className="text-[#800000]" />,
          buttonClass: 'bg-[#800000] text-[#f5e6d3] hover:bg-[#5c4033] font-medieval border-2 border-[#5c4033] shadow-lg',
          inputClass: 'bg-[#eaddcf] border-b-2 border-[#5c4033] text-[#4a3728] font-serif focus:bg-[#dcc8b6]'
        };
      case 'glacial':
        return {
          bgOverlay: 'bg-[#0f172a]/80 backdrop-blur-md',
          modalBg: 'bg-[#e0f7fa]/90 border border-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.4)] backdrop-blur-xl',
          text: 'text-cyan-900 font-display',
          accent: 'text-cyan-600',
          accentBg: 'bg-cyan-500',
          border: 'border-cyan-300',
          title: 'Expedição Polar',
          subtitle: 'Reserve sua entrada no gelo eterno.',
          labels: { adult: 'Explorador', child: 'Pinguim (Meia)', senior: 'Veterano Polar' },
          currency: 'BRL',
          icon: <Snowflake size={24} className="text-cyan-500" />,
          buttonClass: 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-md rounded-xl',
          inputClass: 'bg-white/50 border border-cyan-200 text-cyan-900 focus:ring-2 focus:ring-cyan-400 rounded-lg'
        };
      default:
        return {
          bgOverlay: 'bg-slate-900/90 backdrop-blur-sm',
          modalBg: 'bg-slate-800 border border-slate-700 shadow-2xl',
          text: 'text-white font-sans',
          accent: 'text-accent',
          accentBg: 'bg-accent',
          border: 'border-slate-600',
          title: 'Bilheteria SetLand',
          subtitle: 'Selecione seus ingressos.',
          labels: { adult: 'Adulto', child: 'Infantil / Meia', senior: 'Melhor Idade' },
          currency: 'R$',
          icon: <Ticket size={24} className="text-accent" />,
          buttonClass: 'bg-accent text-slate-900 hover:bg-yellow-400 font-bold rounded-lg',
          inputClass: 'bg-slate-700 border border-slate-600 text-white rounded-lg focus:border-accent'
        };
    }
  };

  const theme = getThemeContent();

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 ${theme.bgOverlay} transition-all duration-500`}>
      
      {/* Container Principal */}
      <div className={`w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col md:flex-row overflow-hidden relative animate-slide-up ${theme.modalBg} ${currentTheme === 'futuristic' ? 'rounded-none' : 'rounded-3xl'}`}>
        
        {/* Decorativos Futuristas */}
        {currentTheme === 'futuristic' && (
            <>
                <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#00f3ff] rounded-tl-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#00f3ff] rounded-br-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute top-4 right-4 text-[#00f3ff] font-mono text-xs animate-pulse">SYSTEM.SECURE_CONNECTION</div>
            </>
        )}

        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-50 p-2 rounded-full transition-colors 
            ${currentTheme === 'futuristic' ? 'text-[#00f3ff] hover:bg-[#00f3ff]/20' : 
              currentTheme === 'medieval' ? 'text-[#800000] hover:bg-[#800000]/10' : 
              'text-slate-400 hover:bg-white/10 hover:text-white'}`}
        >
          <X size={24} />
        </button>

        {/* Lado Esquerdo: Resumo / Visual */}
        <div className={`w-full md:w-1/3 p-8 flex flex-col justify-between relative overflow-hidden
            ${currentTheme === 'futuristic' ? 'bg-[#00f3ff]/5 border-r border-[#00f3ff]/30' : 
              currentTheme === 'medieval' ? 'bg-[#eaddcf] border-r-2 border-[#5c4033] border-dashed' : 
              currentTheme === 'glacial' ? 'bg-cyan-50/50' : 
              'bg-slate-900 border-r border-slate-700'}`
        }>
            {/* Background Image Faint */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <img 
                    src={currentTheme === 'medieval' ? "https://www.transparenttextures.com/patterns/wood-pattern.png" : ""} 
                    className="w-full h-full object-cover" 
                />
            </div>

            <div>
                <div className="flex items-center gap-3 mb-6">
                    {theme.icon}
                    <span className={`text-xl font-bold tracking-wider ${theme.text} opacity-80`}>SETLAND</span>
                </div>
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${theme.text}`}>
                    {theme.title}
                </h2>
                <p className={`text-sm opacity-70 mb-8 ${theme.text}`}>
                    {theme.subtitle}
                </p>

                {/* Resumo do Pedido */}
                <div className={`p-4 rounded-xl space-y-3 
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
                        {tickets.adult > 0 && (
                            <div className={`flex justify-between text-sm ${theme.text}`}>
                                <span>{tickets.adult}x {theme.labels.adult}</span>
                                <span>R$ {(tickets.adult * PRICES.adult).toFixed(2)}</span>
                            </div>
                        )}
                        {tickets.child > 0 && (
                            <div className={`flex justify-between text-sm ${theme.text}`}>
                                <span>{tickets.child}x {theme.labels.child}</span>
                                <span>R$ {(tickets.child * PRICES.child).toFixed(2)}</span>
                            </div>
                        )}
                        {tickets.senior > 0 && (
                            <div className={`flex justify-between text-sm ${theme.text}`}>
                                <span>{tickets.senior}x {theme.labels.senior}</span>
                                <span>R$ {(tickets.senior * PRICES.senior).toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className={`border-t pt-3 mt-2 flex justify-between items-end ${currentTheme === 'medieval' ? 'border-[#5c4033]/20' : 'border-white/20'}`}>
                        <span className={`text-sm ${theme.text}`}>Total</span>
                        <span className={`text-2xl font-bold ${theme.accent}`}>
                            {currentTheme === 'futuristic' ? 'C$ ' : 'R$ '}
                            {total.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Steps Indicator */}
            <div className="flex gap-2 mt-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 
                        ${step >= i ? theme.accentBg : 'bg-gray-500/20'}`} 
                    />
                ))}
            </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="w-full md:w-2/3 p-8 overflow-y-auto relative">
            
            {/* STEP 1: Seleção */}
            {step === 1 && (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* Seleção de Data */}
                    <div>
                        <label className={`block text-sm font-bold mb-3 uppercase tracking-wider ${theme.text}`}>
                            1. Escolha a Data
                        </label>
                        <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`w-full p-4 outline-none transition-all ${theme.inputClass}`}
                        />
                    </div>

                    {/* Seleção de Ingressos */}
                    <div>
                        <label className={`block text-sm font-bold mb-3 uppercase tracking-wider ${theme.text}`}>
                            2. Selecione os Ingressos
                        </label>
                        <div className="space-y-4">
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
                                subLabel="06 a 12 anos"
                                price={PRICES.child}
                                value={tickets.child}
                                onChange={(v) => setTickets({...tickets, child: v})}
                                theme={theme}
                                currentTheme={currentTheme}
                            />
                            {/* Senior */}
                            <TicketCounter 
                                label={theme.labels.senior}
                                subLabel="Acima de 60 anos"
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
                            className={`w-full py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${theme.buttonClass}`}
                        >
                            Continuar <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: Dados Pessoais (Simulado) */}
            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <button onClick={() => setStep(1)} className={`flex items-center gap-2 text-sm hover:underline mb-4 ${theme.text} opacity-60`}>
                        <ArrowLeft size={16} /> Voltar
                    </button>
                    
                    <h3 className={`text-2xl font-bold ${theme.text}`}>Quem vai embarcar?</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={`text-xs uppercase font-bold ${theme.text}`}>Nome Completo</label>
                            <input type="text" placeholder="Seu nome" className={`w-full p-3 outline-none ${theme.inputClass}`} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs uppercase font-bold ${theme.text}`}>E-mail</label>
                            <input type="email" placeholder="seu@email.com" className={`w-full p-3 outline-none ${theme.inputClass}`} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs uppercase font-bold ${theme.text}`}>CPF</label>
                            <input type="text" placeholder="000.000.000-00" className={`w-full p-3 outline-none ${theme.inputClass}`} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs uppercase font-bold ${theme.text}`}>Celular</label>
                            <input type="tel" placeholder="(00) 00000-0000" className={`w-full p-3 outline-none ${theme.inputClass}`} />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={() => setStep(3)}
                            className={`w-full py-4 flex items-center justify-center gap-2 transition-all ${theme.buttonClass}`}
                        >
                            Ir para Pagamento <CreditCard size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: Pagamento (Simulado) */}
            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <button onClick={() => setStep(2)} className={`flex items-center gap-2 text-sm hover:underline mb-4 ${theme.text} opacity-60`}>
                        <ArrowLeft size={16} /> Voltar
                    </button>

                    <h3 className={`text-2xl font-bold ${theme.text}`}>Pagamento</h3>

                    <div className="space-y-3">
                        <button className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-black/5 ${theme.border} ${theme.text}`}>
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <Zap size={20} />
                            </div>
                            <div className="text-left flex-1">
                                <div className="font-bold">PIX (Aprovação Imediata)</div>
                                <div className="text-xs opacity-70">Ganhe 5% de desconto</div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border ${theme.border}`}></div>
                        </button>

                        <button className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-black/5 ${theme.border} ${theme.text}`}>
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <CreditCard size={20} />
                            </div>
                            <div className="text-left flex-1">
                                <div className="font-bold">Cartão de Crédito</div>
                                <div className="text-xs opacity-70">Até 3x sem juros</div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border ${theme.border}`}></div>
                        </button>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={() => setStep(4)}
                            className={`w-full py-4 flex items-center justify-center gap-2 transition-all ${theme.buttonClass}`}
                        >
                            Confirmar Compra
                        </button>
                        <p className={`text-center text-xs mt-3 opacity-50 ${theme.text}`}>
                            Ambiente Seguro. Seus dados estão protegidos.
                        </p>
                    </div>
                </div>
            )}

            {/* STEP 4: Sucesso */}
            {step === 4 && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-slide-up">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 
                        ${currentTheme === 'futuristic' ? 'bg-[#00f3ff]/20 text-[#00f3ff]' : 
                          currentTheme === 'medieval' ? 'bg-[#800000]/20 text-[#800000]' : 
                          'bg-green-100 text-green-600'}`
                    }>
                        <CheckCircle size={48} />
                    </div>
                    <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>
                        {currentTheme === 'medieval' ? 'Glória ao Reino!' : 'Sucesso!'}
                    </h2>
                    <p className={`mb-8 max-w-xs mx-auto opacity-70 ${theme.text}`}>
                        Seus ingressos foram enviados para seu e-mail. Prepare-se para a aventura.
                    </p>
                    <div className={`p-4 rounded-lg mb-8 font-mono text-lg tracking-widest border border-dashed ${theme.border} ${theme.text}`}>
                        #SL-{Math.floor(Math.random() * 99999)}
                    </div>
                    <button 
                        onClick={onClose}
                        className={`px-8 py-3 rounded-lg transition-all ${theme.buttonClass}`}
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

// Sub-componente para contador de ingressos
const TicketCounter: React.FC<{ 
    label: string, 
    subLabel?: string, 
    price: number, 
    value: number, 
    onChange: (val: number) => void,
    theme: any,
    currentTheme: string
}> = ({ label, subLabel, price, value, onChange, theme, currentTheme }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all
        ${currentTheme === 'futuristic' ? 'border-[#00f3ff]/30 hover:border-[#00f3ff]' : 
          currentTheme === 'medieval' ? 'border-[#5c4033]/30 hover:border-[#5c4033] bg-[#fffdf5]' : 
          'bg-white/5 border-white/10 hover:bg-white/10'}`
    }>
        <div>
            <div className={`font-bold ${theme.text}`}>{label}</div>
            {subLabel && <div className={`text-xs opacity-60 ${theme.text}`}>{subLabel}</div>}
            <div className={`font-mono text-sm mt-1 ${theme.accent}`}>
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