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
      aria-label="Aviso de Privacidade e Cookies"
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 sm:right-auto max-w-[calc(100vw-2rem)] sm:max-w-md z-[90] pointer-events-auto transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-5"
    >
      <div
        className="p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md relative overflow-hidden"
        style={{
          background: 'color-mix(in srgb, var(--theme-surface) 94%, transparent)',
          border: '1px solid var(--theme-line)',
          color: 'var(--theme-text)',
        }}
      >
        {/* Detalhe estético: Brilho sutil no topo com o acento da era */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--theme-primary), transparent)',
            opacity: 0.8,
          }}
        />

        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
            <h3
              className="font-serif font-bold text-sm tracking-wide"
              style={{ color: 'var(--theme-text)' }}
            >
              Proteção do Reino & Privacidade
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--theme-muted)' }}
            aria-label="Fechar aviso temporariamente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs leading-relaxed font-sans mb-3" style={{ color: 'var(--theme-muted)' }}>
          Utilizamos cookies e tecnologias essenciais para memorizar sua Era escolhida e garantir
          sua imersão pelo Castelo de Setland, em conformidade com a LGPD (Lei nº 13.709/2018).
        </p>

        {/* Bloco Expansível de Detalhes dos Dados */}
        {showDetails && (
          <div
            className="my-3 p-3 rounded-xl text-[11px] space-y-2 border"
            style={{
              background: 'color-mix(in srgb, var(--theme-surface-soft) 85%, transparent)',
              borderColor: 'var(--theme-line-soft)',
              color: 'var(--theme-muted)',
            }}
          >
            <div>
              <strong className="block" style={{ color: 'var(--theme-primary)' }}>
                1. Atmosfera e Preferências:
              </strong>
              Memorização de tema (Medieval, Glacial, Futurista) e acessibilidade de animações.
            </div>
            <div>
              <strong className="block" style={{ color: 'var(--theme-primary)' }}>
                2. Ingressos e Experiência:
              </strong>
              Seu nome, contato e data de visita são usados estritamente para emissão de voucher e atendimento na portaria.
            </div>
            <div
              className="p-2.5 rounded-lg border"
              style={{
                background: 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
                borderColor: 'var(--theme-line-soft)',
              }}
            >
              <strong className="block flex items-center gap-1" style={{ color: 'var(--theme-primary)' }}>
                <Sparkles className="w-3 h-3" /> 3. Dados Financeiros & Checkout:
              </strong>
              <span className="text-[10.5px] leading-relaxed" style={{ color: 'var(--theme-subtle)' }}>
                Módulo de faturamento online em fase de implantação. Nesta versão de demonstração, nenhum dado financeiro ou de pagamento é coletado ou processado.
              </span>
            </div>
          </div>
        )}

        {/* Ações do Banner */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t"
          style={{ borderColor: 'var(--theme-line-soft)' }}
        >
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] hover:underline cursor-pointer font-medium"
            style={{ color: 'var(--theme-primary)' }}
          >
            {showDetails ? 'Ocultar detalhes' : 'Ver como tratamos seus dados'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptEssential}
              className="px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--theme-card-border)',
                color: 'var(--theme-text)',
                background: 'var(--theme-card-bg)',
              }}
            >
              Apenas Essenciais
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-1.5 rounded-xl font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer font-serif"
              style={{
                background: 'linear-gradient(135deg, var(--theme-primary-strong), var(--theme-primary))',
                color: 'var(--theme-on-primary)',
              }}
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
