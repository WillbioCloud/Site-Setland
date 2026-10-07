// Only relative, same-origin endpoints are accepted. Provider secrets belong on the server.
function resolveEndpoint(path: string | undefined): string | undefined {
  if (!path?.startsWith('/') || path.startsWith('//')) return undefined;
  try {
    const url = new URL(path, window.location.origin);
    return url.origin === window.location.origin ? `${url.pathname}${url.search}` : undefined;
  } catch {
    return undefined;
  }
}
const endpoint = resolveEndpoint(import.meta.env.VITE_ASSISTANT_ENDPOINT);
export const hasConnectedAssistant = Boolean(endpoint);
const normalize = (message: string) =>
  message
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function localGuide(message: string): string {
  const text = normalize(message);
  if (/horario|funciona|abre|fecha|domingo|segunda/.test(text))
    return 'O horário informado é de terça a domingo, das 9h às 18h. Em feriados e datas especiais, confirme a programação com a equipe do parque pelo Instagram @7setland.';
  if (/ingresso|valor|preco|custa|comprar|pix|pagamento/.test(text))
    return 'A inteira é R$ 89,90; o ingresso infantil (6 a 12 anos) e o sênior (60+) são R$ 44,90. Crianças até 5 anos não pagam. O planejador do site é uma simulação, sem cobrança ou emissão de ingressos. Confirme valores e disponibilidade com a equipe.';
  if (/gelo|frio|glacial|casaco|roupa/.test(text))
    return 'O Parque de Gelo é uma experiência a −17 °C! O Setland disponibiliza casacos higienizados. Prefira roupas confortáveis e calçados fechados e consulte os monitores sobre as orientações de acesso.';
  if (/comida|comer|alimento|cardapio|restaurante|bebida/.test(text))
    return 'O cardápio reúne entradas, pratos, pizzas, opções infantis e bebidas. Você pode consultá-lo em Gastronomia. Não é permitida a entrada de alimentos e bebidas, exceto papinhas infantis e dietas especiais. Confirme restrições alimentares com a equipe.';
  if (/onde|local|chegar|endereco/.test(text))
    return 'O Setland fica em Caldas Novas, Goiás. Em “Planeje sua visita”, use “Como chegar” para abrir a localização no Google Maps.';
  if (/crianca|filho|familia|pequeno|idade/.test(text))
    return 'Há cenários e experiências para aproveitar em família, incluindo o playground. Crianças até 5 anos não pagam; de 6 a 12 anos, o ingresso infantil é R$ 44,90. Confirme as condições e os limites de cada atração com os monitores.';
  if (/atrac|era|parque|medieval|futur|teatro|sabre/.test(text))
    return 'Sua viagem passa por três eras: Glacial, Medieval e Futurística. Conheça o Parque de Gelo, a Vila Medieval, o Playground, o Laboratório Neon e as apresentações teatrais. A programação dos espetáculos deve ser confirmada no dia da visita.';
  return 'Posso ajudar com horários, ingressos, atrações, o Parque de Gelo e gastronomia. Para informações específicas ou para confirmar sua visita, fale com a equipe pelo Instagram @7setland. Não envie dados pessoais ou de pagamento por aqui.';
}

/** Preserves the assistant interface without exposing provider credentials in the client bundle. */
export async function getGeminiResponse(userMessage: string): Promise<string> {
  if (!hasConnectedAssistant || !endpoint) return localGuide(userMessage);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error('Assistant unavailable');
    const data: { text?: unknown } = await response.json();
    if (typeof data.text !== 'string' || !data.text.trim()) throw new Error('Empty response');
    return data.text;
  } catch {
    return `O atendimento conectado está indisponível agora, mas posso usar as informações do guia.\n\n${localGuide(userMessage)}`;
  }
}
