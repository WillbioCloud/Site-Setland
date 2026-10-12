import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, X } from 'lucide-react';

const COOKIE_STORAGE_KEY = 'setland_cookie_consent_v1';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!consent) {
      // Pequeno delay para entrada suave após o carregamento da página
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      COOKIE_STORAGE_KEY,
      JSON.stringify({
        acceptedAt: new Date().toISOString(),
        level: 'all',
      }),
    );
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(
      COOKIE_STORAGE_KEY,
      JSON.stringify({
        acceptedAt: new Date().toISOString(),
        level: 'essential',
      }),
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de Privacidade e Cookies"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-[90] pointer-events-auto transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-5"
    >
      {/* Moldura Medieval do Castelo: Bordas douradas e fundo bordô escuro */}
      <div className="bg-[#240710]/95 border-2 border-[#D9A45C]/80 text-[#FDF9F3] p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md relative overflow-hidden">
        {/* Detalhe estético: Brilho sutil dourado no topo */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D9A45C] to-transparent opacity-80" />

        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D9A45C] shrink-0" />
            <h3 className="font-serif font-bold text-sm tracking-wide text-[#FDF9F3]">
              Proteção do Reino & Privacidade
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar aviso temporariamente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-white/80 leading-relaxed font-sans mb-3">
          Utilizamos cookies e tecnologias essenciais para memorizar sua Era escolhida e garantir
          sua imersão pelo Castelo de Setland, em conformidade com a LGPD (Lei nº 13.709/2018).
        </p>

        {/* Bloco Expansível de Detalhes dos Dados */}
        {showDetails && (
          <div className="my-3 p-3 bg-black/40 border border-[#D9A45C]/30 rounded-xl text-[11px] text-white/75 space-y-2">
            <div>
              <strong className="text-[#D9A45C] block">1. Atmosfera e Preferências:</strong>
              Memorização de tema (Medieval, Glacial, Futurista) e acessibilidade de animações.
            </div>
            <div>
              <strong className="text-[#D9A45C] block">2. Ingressos e Experiência:</strong>
              Seu nome, contato e data de visita são usados estritamente para emissão de voucher e
              atendimento na portaria.
            </div>
            {/* PLACEHOLDER ESTRUTURADO PARA O CHECKOUT */}
            <div className="p-2 bg-[#350A18]/60 border border-dashed border-[#D9A45C]/40 rounded-lg">
              <strong className="text-[#D9A45C] block flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 3. Dados Financeiros & Checkout (Em Breve):
              </strong>
              <span className="italic text-white/65">
                [Espaço reservado: As informações de pagamento, CPF e faturamento serão processadas
                diretamente pelo gateway seguro integrado com criptografia ponta a ponta quando as
                vendas online forem ativadas.]
              </span>
            </div>
          </div>
        )}

        {/* Ações do Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D9A45C]/20">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-[#D9A45C] hover:underline cursor-pointer font-medium"
          >
            {showDetails ? 'Ocultar detalhes' : 'Ver como tratamos seus dados'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptEssential}
              className="px-3 py-1.5 rounded-xl border border-white/20 text-[11px] font-medium text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Apenas Essenciais
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D9A45C] to-[#BF883E] text-[#240710] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer font-serif"
            >
              Aceitar e Entrar
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CookieConsentBanner;
