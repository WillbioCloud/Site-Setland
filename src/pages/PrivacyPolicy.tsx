import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

export function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Navegação de Retorno */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-serif transition-colors mb-8 group"
          style={{ color: 'var(--theme-primary)' }}
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Voltar ao Castelo
        </Link>

        {/* Cabeçalho */}
        <header
          className="pb-8 mb-10"
          style={{ borderBottom: '1px solid var(--theme-line-soft)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif mb-4 border"
            style={{
              background: 'var(--theme-surface)',
              borderColor: 'var(--theme-line-soft)',
              color: 'var(--theme-primary)',
            }}
          >
            <ShieldCheck size={14} />
            Privacidade & LGPD
          </div>
          <h1
            className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--theme-text)' }}
          >
            Política de Privacidade do Reino
          </h1>
          <p
            className="text-sm max-w-2xl leading-relaxed"
            style={{ color: 'var(--theme-muted)' }}
          >
            Transparência e segurança sobre como tratamos suas informações pessoais ao explorar o universo do Setland Parque Temático, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>
          <span
            className="block mt-4 text-xs font-mono"
            style={{ color: 'var(--theme-primary)' }}
          >
            Última atualização: Outubro de 2026
          </span>
        </header>

        {/* Conteúdo Jurídico */}
        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--theme-muted)' }}>
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2
              className="font-serif text-lg font-semibold flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}
            >
              <Eye size={18} style={{ color: 'var(--theme-primary)' }} /> 1. Controlador dos Dados
            </h2>
            <p>
              O <strong style={{ color: 'var(--theme-text)' }}>Setland Parque Temático</strong> atua como Controlador dos dados pessoais coletados por meio deste site oficial, quiosques de autoatendimento e plataformas integradas ao ecossistema do parque em Caldas Novas, Goiás.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2
              className="font-serif text-lg font-semibold flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}
            >
              <FileText size={18} style={{ color: 'var(--theme-primary)' }} /> 2. Dados Coletados e Finalidades
            </h2>
            <p>Tratamos exclusivamente os dados necessários para garantir a sua experiência:</p>
            <ul className="space-y-3 pl-1">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
                <span>
                  <strong style={{ color: 'var(--theme-text)' }}>Navegação e Atmosfera (Cookies e LocalStorage):</strong> Memorização do tema de era escolhido (Medieval, Glacial ou Futurista) e ajustes de acessibilidade. <em>Base Legal: Legítimo Interesse.</em>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
                <span>
                  <strong style={{ color: 'var(--theme-text)' }}>Reserva de Ingressos (Modal de Ingressos):</strong> Nome completo, e-mail, telefone/WhatsApp, data de visitação e número de pessoas. Utilizados para emissão de vouchers e atendimento na portaria. <em>Base Legal: Procedimentos preliminares de contrato.</em>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
                <span>
                  <strong style={{ color: 'var(--theme-text)' }}>Assistente Virtual:</strong> Dúvidas e mensagens digitadas no chat para esclarecimento imediato de atrações e gastronomia, sem retenção de dados sensíveis. <em>Base Legal: Atendimento ao cliente.</em>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
                <span>
                  <strong style={{ color: 'var(--theme-text)' }}>Portal de Fotos:</strong> Identificação de pulseira ou voucher para disponibilização de fotos temáticas registradas nas atrações. <em>Base Legal: Cumprimento de contrato de serviço fotográfico.</em>
                </span>
              </li>
            </ul>
          </section>

          {/* Seção 3 - Faturamento Online */}
          <section
            className="p-5 rounded-2xl border space-y-3"
            style={{
              background: 'color-mix(in srgb, var(--theme-surface) 75%, transparent)',
              borderColor: 'var(--theme-line-soft)',
            }}
          >
            <h2
              className="font-serif text-lg font-semibold flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}
            >
              <Sparkles size={18} style={{ color: 'var(--theme-primary)' }} /> 3. Dados de Pagamento & Checkout
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-muted)' }}>
              Módulo de faturamento online em fase de implantação. Nesta versão de demonstração, nenhum dado financeiro é coletado ou processado.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-subtle)' }}>
              Quando a venda direta de ingressos e produtos for liberada nesta plataforma, dados cadastrais e de cobrança (como CPF/CNPJ, endereço e dados de cartão/PIX) serão coletados com o propósito exclusivo de processamento de pagamento, combate a fraudes e emissão de notas fiscais. Nenhuma informação bancária sensível de cartão é armazenada nos nossos servidores, sendo operada diretamente pela processadora credenciada com certificação PCI-DSS.
            </p>
          </section>

          {/* Seção 4 - Layout Editorial Limpo */}
          <section className="space-y-4">
            <h2
              className="font-serif text-lg font-semibold flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}
            >
              <Lock size={18} style={{ color: 'var(--theme-primary)' }} /> 4. Seus Direitos como Titular (Art. 18 da LGPD)
            </h2>
            <p style={{ color: 'var(--theme-muted)' }}>Você tem o direito de solicitar a qualquer momento:</p>
            <ul className="space-y-2.5 pl-1">
              {[
                'Confirmação da existência de tratamento dos seus dados',
                'Acesso facilitado aos dados coletados',
                'Correção de dados incompletos ou inexatos',
                'Eliminação ou anonimização de dados desnecessários',
                'Revogação do consentimento concedido anteriormente',
                'Informação sobre entidades públicas e privadas com quem compartilhamos dados',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-xs leading-relaxed">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                    style={{ background: 'var(--theme-primary)' }}
                    aria-hidden="true"
                  />
                  <span style={{ color: 'var(--theme-text)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2
              className="font-serif text-lg font-semibold"
              style={{ color: 'var(--theme-primary)' }}
            >
              5. Armazenamento e Segurança
            </h2>
            <p>
              Adotamos protocolos rígidos de segurança da informação, criptografia HTTPS/TLS e controles de acesso para proteger seus dados contra acessos não autorizados, perdas ou alterações ilícitas.
            </p>
          </section>

          {/* Seção 6 */}
          <section
            className="space-y-3 pt-6 border-t"
            style={{ borderColor: 'var(--theme-line-soft)' }}
          >
            <h2
              className="font-serif text-lg font-semibold"
              style={{ color: 'var(--theme-primary)' }}
            >
              6. Contato com o Encarregado de Dados (DPO)
            </h2>
            <p>
              Para exercer qualquer direito previsto na LGPD ou esclarecer dúvidas sobre o tratamento de seus dados, entre em contato com a equipe de governança de Setland pelo e-mail:
            </p>
            <div
              className="p-3.5 border rounded-xl inline-block text-xs font-mono"
              style={{
                background: 'var(--theme-surface)',
                borderColor: 'var(--theme-line-soft)',
                color: 'var(--theme-primary)',
              }}
            >
              privacidade@setland.com.br
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
