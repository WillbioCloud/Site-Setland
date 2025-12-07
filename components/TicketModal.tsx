import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Ticket } from 'lucide-react';
import { Button } from './Button';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);

  if (!isOpen) return null;

  const total = (adults * 89.90) + (kids * 44.90);

  const handleNext = () => setStep(2);
  const handlePurchase = () => setStep(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-display font-bold text-white mb-2">Selecione seus Ingressos</h2>
              <p className="text-slate-400 mb-6">Venha viver a aventura no SetLand!</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl">
                  <div>
                    <span className="block font-bold text-white">Adulto</span>
                    <span className="text-sm text-slate-400">R$ 89,90</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setAdults(Math.max(0, adults - 1))} className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center">-</button>
                    <span className="font-bold w-4 text-center">{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full bg-accent text-slate-900 hover:bg-yellow-400 flex items-center justify-center">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl">
                  <div>
                    <span className="block font-bold text-white">Infantil / Meia</span>
                    <span className="text-sm text-slate-400">R$ 44,90</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setKids(Math.max(0, kids - 1))} className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center">-</button>
                    <span className="font-bold w-4 text-center">{kids}</span>
                    <button onClick={() => setKids(kids + 1)} className="w-8 h-8 rounded-full bg-accent text-slate-900 hover:bg-yellow-400 flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 mb-6 flex justify-between items-center">
                <span className="text-slate-300">Total</span>
                <span className="text-2xl font-bold text-accent">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>

              <Button fullWidth onClick={handleNext} disabled={total === 0}>
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Pagamento Rápido</h2>
              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors border border-transparent hover:border-accent">
                  <CreditCard className="text-accent" />
                  <span className="font-semibold">Cartão de Crédito</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors border border-transparent hover:border-accent">
                  <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2zm-5.32 15.36L8.1 14.58c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l2.23 2.23 4.77-4.77c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-5.3 5.3c-.15.15-.34.22-.53.22s-.39-.07-.52-.2z"/></svg>
                  <span className="font-semibold">PIX (5% de desconto)</span>
                </button>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Voltar</Button>
                <Button fullWidth onClick={handlePurchase} className="flex-[2]">Pagar R$ {total.toFixed(2).replace('.', ',')}</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 animate-slide-up">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Compra Realizada!</h2>
              <p className="text-slate-400 mb-6">Seus ingressos foram enviados para o seu e-mail.</p>
              <div className="bg-slate-700/50 p-4 rounded-xl mb-6 flex items-center justify-center gap-2">
                <Ticket className="text-accent" />
                <span className="font-mono text-lg tracking-widest text-white">#SL-{Math.floor(Math.random() * 99999)}</span>
              </div>
              <Button fullWidth onClick={onClose}>Fechar</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};