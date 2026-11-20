import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Castle, ShieldAlert, Camera, Ticket, Scale } from 'lucide-react';

export function TermsOfUse() {
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
            <Scale size={14} />
            Regulamento do Parque
          </div>
          <h1
            className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--theme-text)' }}
          >
            Termos & Condições de Uso
          </h1>
          <p
            className="text-sm max-w-2xl leading-relaxed"
            style={{ color: 'var(--theme-muted)' }}
          >
            Regras de convivência, acesso às três eras temáticas, ingressos e diretrizes gerais para visitantes do Setland Parque Temático.
          </p>
          <span
            className="block mt-4 text-xs font-mono"
            style={{ color: 'var(--theme-primary)' }}
          >
            Vigência: Outubro de 2026
          </span>
        </header>

        {/* Conteúdo dos Termos */}
        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--theme-muted)' }}>
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2
              className="font-serif text-lg font-semibold flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}
            >
              <Castle size={18} style={{ color: 'var(--theme-primary)' }} /> 1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar este website, utilizar nossos quiosques digitais ou ingressar nas instalações do Setland Parque Temático, o visitante declara conhecer e concordar expressamente com este regulamento.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2
              className="font-serif text-lg font-semibold flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}
            >
              <Ticket size={18} style={{ color: 'var(--theme-primary)' }} /> 2. Ingressos, Vouchers e Reservas
            </h2>
            <ul className="space-y-2 list-disc list-inside" style={{ color: 'var(--theme-muted)' }}>
              <li>Os ingressos são pessoais, intransferíveis e válidos estritamente para a data e faixa de horário agendadas.</li>
              <li>A apresentação de documento com foto ou do QR Code emitido na reserva é obrigatória na entrada das muralhas.</li>
              <li>Cancelamentos ou reagendamentos devem ser solicitados com no mínimo 24 horas de antecedência aos canais oficiais de suporte do parque.</li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2
              className="font-serif text-lg font-semibold flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}
            >
              <ShieldAlert size={18} style={{ color: 'var(--theme-primary)' }} /> 3. Segurança nas Atrações e Eras Temáticas
            </h2>
            <p>
              O parque é dividido em três eras (Glacial, Medieval e Futurista). Cada setor possui regras específicas de segurança física:
            </p>
            <div className="space-y-3 pt-1">
              <div
                className="p-3.5 border rounded-xl"
                style={{
                  background: 'color-mix(in srgb, var(--theme-surface) 75%, transparent)',
                  borderColor: 'var(--theme-line-soft)',
                }}
              >
                <strong className="block mb-1 font-semibold" style={{ color: 'var(--theme-text)' }}>
                  Parque de Gelo (−17 °C):
                </strong>
                <span style={{ color: 'var(--theme-muted)' }}>
                  É obrigatório o uso das roupas térmicas e calçados fechados recomendados pela equipe. O tempo máximo de permanência na câmara fria deve respeitar os avisos de segurança.
                </span>
              </div>
              <div
                className="p-3.5 border rounded-xl"
                style={{
                  background: 'color-mix(in srgb, var(--theme-surface) 75%, transparent)',
                  borderColor: 'var(--theme-line-soft)',
                }}
              >
                <strong className="block mb-1 font-semibold" style={{ color: 'var(--theme-text)' }}>
                  Áreas Medievais e Atrações Mecânicas:
                </strong>
                <span style={{ color: 'var(--theme-muted)' }}>
                  Respeite os limites de altura, peso e condições de saúde sinalizados na entrada de cada atração. Crianças devem estar acompanhadas por responsáveis.
                </span>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2
              className="font-serif text-lg font-semibold flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}
            >
              <Camera size={18} style={{ color: 'var(--theme-primary)' }} /> 4. Registro de Imagens e Fotografias
            </h2>
            <p>
              Fotógrafos autorizados do Setland registram momentos dos visitantes pelas vilas e castelos para disponibilização no <strong style={{ color: 'var(--theme-text)' }}>Portal de Fotos</strong>.
            </p>
            <p style={{ color: 'var(--theme-subtle)' }}>
              Ao circular pelas áreas do parque, o visitante autoriza o registro fotográfico vinculado à sua pulseira de identificação. Caso não deseje que sua imagem seja capturada nas atrações, basta comunicar à equipe ou aos fotógrafos credenciados no momento da visita.
            </p>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2
              className="font-serif text-lg font-semibold"
              style={{ color: 'var(--theme-primary)' }}
            >
              5. Propriedade Intelectual
            </h2>
            <p>
              Todos os elementos narrativos, cenários, nomes das eras, logotipo e o mascote guardião (lobo-yeti da neve) são propriedades intelectuais exclusivas de Setland. É proibida a reprodução comercial ou exploração de marca sem autorização prévia por escrito.
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
              6. Foro e Disposições Finais
            </h2>
            <p>
              Este regulamento é regido pelas leis da República Federativa do Brasil, em especial o Código de Defesa do Consumidor. Fica eleito o Foro da Comarca de Caldas Novas, Estado de Goiás, para dirimir eventuais controvérsias decorrentes deste termo.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfUse;
