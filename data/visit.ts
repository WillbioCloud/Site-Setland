export const TICKET_PRICES = { adult: 89.9, child: 44.9, senior: 44.9 };

/** Sum integer cents so the integration never receives accumulated floating-point artifacts. */
export function calculateTicketTotal(tickets: Record<keyof typeof TICKET_PRICES, number>): number {
  return (
    (Object.keys(TICKET_PRICES) as (keyof typeof TICKET_PRICES)[]).reduce(
      (cents, type) => cents + Math.round(TICKET_PRICES[type] * 100) * tickets[type],
      0,
    ) / 100
  );
}
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const faqs = [
  {
    question: 'Qual é o horário de funcionamento?',
    answer:
      'O horário informado pelo parque é de terça a domingo, das 9h às 18h. A programação pode mudar em feriados e datas especiais. Confirme com a equipe antes de sair de casa.',
  },
  {
    question: 'Crianças também pagam ingresso?',
    answer:
      'Crianças de até 5 anos têm entrada gratuita. De 6 a 12 anos, o ingresso infantil tem valor de meia-entrada. Leve um documento para comprovação da idade e confirme as condições com a bilheteria.',
  },
  {
    question: 'Preciso levar um casaco para o Parque de Gelo?',
    answer:
      'O parque disponibiliza casacos higienizados para a experiência a −17 °C. Prefira roupas confortáveis e calçados fechados. Consulte a equipe para orientações específicas antes de entrar.',
  },
  {
    question: 'Posso entrar com alimentos e bebidas?',
    answer:
      'A entrada de alimentos e bebidas não é permitida, com exceção de papinhas infantis e dietas especiais. Há opções de alimentação no parque; você pode consultar o cardápio completo aqui no site.',
  },
  {
    question: 'Como planejar e confirmar minha visita?',
    answer:
      'Use a opção Ingressos para selecionar uma data e calcular o valor da visita. No momento, esse fluxo é uma simulação: não cobra pagamentos nem emite ingressos. Para confirmar disponibilidade e comprar, fale com a equipe pelos canais de contato.',
  },
];

export function localDateISO(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function validVisitDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    localDateISO(parsed) === value &&
    value >= localDateISO() &&
    parsed.getDay() !== 1
  );
}
