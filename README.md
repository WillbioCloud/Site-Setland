# Setland — uma viagem além do tempo

Portal do parque temático Setland em **React + TypeScript + Vite**, com uma identidade cinematográfica, fotos do próprio projeto e atmosferas Glacial, Medieval e Futurística.

## Executar

Recomendado: **Node.js 22.12+**.

```bash
npm ci
npm run dev
```

O site fica disponível na porta `3000`. O servidor escuta em `0.0.0.0` e aceita os hosts de prévia `*.e2b.app`.

```bash
npm run typecheck     # Verificação estrita de TypeScript
npm run build         # Typecheck + build de produção em dist/
npm run preview       # Conferir a versão de produção
npm run format:check  # Conferir a formatação
```

## Rotas e recursos

- **`/`**: vídeo de abertura, três eras, seis atrações com filtros, gastronomia, informações de visita e FAQ.
- **`/cardapio`**: as **21 categorias e 124 itens originais**, com preços preservados, cards fotográficos, busca sem distinção de acentos (incluindo temas e categorias), navegação por categoria e links diretos como `/cardapio#cat-pizzas`. Os destaques da home também levam diretamente ao item, por exemplo `/cardapio#item-pratos-file-mignon-a-parmegiana`.
- **Temas**: atmosfera original, Glacial, Medieval e Futurística. A preferência é salva localmente; cores mudam de forma sutil, mantendo tipografia e hierarquia consistentes.
- **Ingressos**: planejador em etapas, contadores, validação de data e dados, revisão e cálculo de valores.
- **Guia virtual**: informações locais úteis mesmo sem serviço de IA configurado.
- **Acessibilidade**: modais nativos com foco contido e restaurado, Escape, navegação por teclado, estados anunciados e respeito a movimento reduzido.

## Importante: ingressos em modo de simulação

O repositório não tem gateway de pagamento nem emissão de ingressos. Por isso, o fluxo padrão **não cobra, não reserva, não envia e-mails e não gera um número de pedido fictício**. A interface informa isso antes e depois do planejamento.

O componente `TicketModal` mantém a integração opcional `onCheckout(data): Promise<void>` e o formato `CheckoutData`. Ao conectar um serviço real, ele deve validar preços, documentos, datas e disponibilidade **no servidor**. Não confie no total enviado pelo navegador. O componente trata rejeições e só apresenta confirmação quando a Promise é resolvida.

Os dados do planejador ficam na memória da página e são apagados ao fechar a janela.

## Assistente: integração opcional e segura

Nenhuma chave de provedor é incorporada ao JavaScript. Sem configuração, o guia responde localmente sobre as informações do parque.

Para conectar Gemini ou outro serviço, implemente um endpoint no seu servidor e configure `.env.local` a partir de `.env.example`:

```env
VITE_ASSISTANT_ENDPOINT=/api/assistant
```

Contrato esperado:

```http
POST /api/assistant
Content-Type: application/json

{"message":"Qual é o horário de funcionamento?"}
```

```json
{ "text": "A resposta do seu serviço de atendimento." }
```

O caminho deve ser relativo à mesma origem. O serviço de produção precisa implementar autenticação quando aplicável, limites de uso e validação. Configure o proxy no seu ambiente se o backend for separado. **Nunca coloque chaves privadas em variáveis `VITE_*`**; a antiga injeção de `GEMINI_API_KEY` no cliente foi removida. Em falhas ou timeout, o guia volta às informações locais.

## Testes

```bash
npx playwright install --with-deps chromium
npm test
```

A suíte executa cenários em desktop e mobile: vídeo/fallback, temas, modais, filtros, navegação, cardápio, formulários, simulação de ingressos e checagens automatizadas WCAG AA com axe. O vídeo externo é interceptado nos testes para validar o fallback de forma determinística.

Para usar um Chromium já instalado:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/caminho/do/chromium npm test
```

Relatórios, traces e screenshots de teste são ignorados pelo Git. Testes automatizados complementam, mas não substituem, avaliação manual com tecnologias assistivas.

## Organização e manutenção

```text
components/        Componentes de interface e fluxos
components/menu/   Cards fotográficos e capítulos do cardápio
context/           Preferência de atmosfera
hooks/             Preferência de movimento reduzido
pages/             Home e cardápio
services/          Adaptador do guia virtual
data/              Atrações, eras, cardápio, informações e validações
assets/            Mídia original preservada
assets/optimized/  Derivados WebP usados na interface
assets/menu/       Fotografias locais e registro das origens
styles.css         Tokens, componentes visuais e breakpoints
styles/menu.css    Estilos e breakpoints exclusivos do cardápio
```

Os horários, preços e condições foram mantidos a partir do conteúdo existente: confirme-os com o parque antes de publicar. Altere `data/visit.ts`, `data/menu.ts`, `data/park.ts` e as respostas locais em `services/geminiService.ts` quando necessário.

Os arquivos em `assets/optimized/` foram derivados das fotos e logos já presentes em `/assets`. As fotos de referência do cardápio estão versionadas em `assets/menu/`: não dependem da disponibilidade de serviços externos durante a visita. As fontes Cinzel e Inter são servidas localmente. O GIF pesado e os assets antigos não utilizados não entram no bundle de produção.

### Imagens e apresentação do cardápio

`data/menuMedia.ts` mapeia as 21 categorias e as fotos específicas dos itens, sem misturar apresentação com os 124 nomes, preços e descrições originais. O TypeScript exige uma imagem e um fallback para cada categoria.

Cada card apresenta foto em largura total, título sobreposto com gradiente de leitura, badge temática, descrição completa e preço dourado no corpo. Nenhuma descrição é truncada. Imagens específicas, referências de categoria e ambientações temáticas são identificadas na interface; não se afirma que uma foto genérica representa exatamente o prato servido. Não foram inventadas classificações de popularidade.

Consulte [as origens e orientações de uso das fotografias](assets/menu/README.md) antes da publicação comercial. Substitua referências externas por fotos próprias sempre que disponíveis.

A suíte de testes compara o catálogo com `tests/fixtures/menu-original.json`, extraído do código original, verifica o posicionamento dos títulos sobre as fotos e testa falhas de imagem, filtros, navegação por teclado e links diretos por item. O cardápio é carregado sob demanda, com imagens lazy e estilos separados da home.

## Publicação

Publique o conteúdo de `dist/` em um host estático. Configure fallback de SPA para `index.html`, preservando o acesso direto a `/cardapio` e demais URLs do React Router. Sirva `/api/*` pelo backend, sem redirecioná-lo para o HTML da aplicação.

O hero usa a URL de vídeo Cloudinary solicitada, com `loop`, `muted`, `playsInline`, `object-cover`, overlay e vinheta. Autoplay é desativado quando há preferência por movimento reduzido, o vídeo pausa fora de vista e há uma foto local para carregamento, falha de rede ou reprodução bloqueada.
