# SDD — Refinamento Final de UI/UX, Mapa 3D Fiel ao Modelo e Polimento Temático (Setland)

## 1. CONTEXTO E REGRAS DE SEGURANÇA (GUARDRAILS)
- **Objetivo:** Realizar o pente fino final de Design, UX, Performance e consistência temática no portal Setland, preparando-o para demonstração comercial.
- **Preservação Estrita:**
  * NÃO altere as regras responsivas já estabilizadas para os temas **Glacial** (`frost.css`) e **Medieval** (`MedievalMascotPeek.tsx` e molduras em `theme.css`) no mobile (`380px` a `900px`).
  * Mantenha todas as rotas (`/`, `/cardapio`, `/privacidade`, `/termos`), os 124 itens do cardápio e a lógica de simulação de ingressos intactos.
  * Respeite `prefers-reduced-motion` em todas as animações novas e preserve contraste WCAG AA e ausência de overflow horizontal (`overflow-x`).

---

## 2. ESPECIFICAÇÕES TÉCNICAS POR MÓDULO

### TAREFA 1: Botão-Ticket Vetorial no Hero (`TicketCtaButton.tsx` + `styles.css` + `Hero.tsx`)
Substitua o botão primário padrão `"Garanta seu ingresso"` no `Hero.tsx` por um componente de botão em formato de **ingresso tátil vetorial (SVG)** inspirado no `event-ticket-card` (Reacticx), mantendo exatamente a escala compacta do botão atual (`min-height: 52px`).

- **Anatomia Visual do Botão-Ticket:**
  * Formato de bilhete horizontal com **entalhes semicirculares nas bordas esquerda e direita** (ou recorte em `<svg>`/`mask-image` nítido) e uma **linha vertical pontilhada de picote** separando o canhoto esquerdo (com o ícone `<Ticket />`) do corpo principal (texto `"Garanta seu ingresso"` + `<ArrowRight />`).
  * **Reatividade aos Temas:** Deve consumir exclusivamente os tokens `--theme-primary`, `--theme-primary-strong` e `--theme-on-primary`, adaptando-se automaticamente ao dourado (Default/Medieval), azul glacial (Glacial) e ciano/violeta (Futurista).
  * **Microinteração:** Efeito sutil de reflexo/sheen diagonal no hover, elevação leve (`translateY(-2px)`) e feedback tátil (`scale(0.985)` no `:active`), sem animações em loop contínuo.
  * **Responsividade Mobile (`<= 680px`):** Deve ocupar `width: 100%` dentro de `.hero__actions` (até `max-width: 390px`) sem quebrar texto ou gerar scroll horizontal.

---

### TAREFA 2: Refatoração do Mapa 3D para Fidelidade Total ao Objeto (`InteractiveMapCanvas.tsx` & `interactive-map.css`)
O modelo `/models/old-map.glb` deve ser o único elemento 3D em cena, fiel à sua malha e texturas originais, sem cenários artificiais criados com primitivas do Three.js.

- **Remoção de Geometria Procedural Artificial:**
  * REMOVA completamente a mesa de madeira procedural (`makeWoodTexture`, `tableTop`, `board`, `apron`), os blocos de pedra (`stoneBase`, `block`), os trilhos/pregos de latão (`trim`, `rail`, `nail`), as tochas/velas (`torchStem`, `flame` e `SphereGeometry` de fogo) e os cilindros/argolas falsos (`closedScroll`, `rollCore`, `rollBands`).
  * Mantenha apenas o modelo `/models/old-map.glb` centralizado e normalizado em escala, apoiado sobre um plano invisível receptor de sombra suave (`ShadowMaterial` com opacidade baixa) e iluminado por luz ambiente + luz direcional suave de estúdio.
- **Animação Fiel ao Modelo (Suporte Nativo a GLB Rigado/Animado + Fallback):**
  * Verifique se `gltf.animations` possui clipes de animação (`gltf.animations.length > 0`).
  * **Caso tenha animação nativa (ex: modelo do Sketchfab/Blender com abertura):** Instancie `THREE.AnimationMixer(gltf.scene)`, ative o clipe principal (`gltf.animations[0]`) e sincronize o tempo do clipe diretamente com `sceneMotion.current.progress` usando `mixer.setTime(Math.min(clip.duration * 0.999, clip.duration * opening))`. Assim, o objeto 3D original abre e fecha exatamente conforme foi modelado/rigado.
  * **Caso seja um `.glb` estático sem clipes (`gltf.animations.length === 0`):** Aplique uma transição limpa e não-destrutiva (ex: escala suave de abertura / inclinação 3D elegante) sem adicionar cilindros ou objetos externos falsos ao redor do mapa.
- **Integração Visual com os 3 Temas (`interactive-map.css`):**
  * Substitua o fundo marrom fixo da `.interactive-map-section` por uma composição que mescle as bordas superior e inferior com `var(--theme-bg)` e use acentos sutis de `var(--theme-primary)`, eliminando o corte seco ao navegar nos temas **Glacial** e **Futurista**.

---

### TAREFA 3: Pente Fino de Design & UX (Remoção de "Cara de IA" e Unificação Temática)
1. **Unificação das Páginas Jurídicas (`PrivacyPolicy.tsx` e `TermsOfUse.tsx`):**
   * Substitua todas as cores hardcoded (`bg-[#120308]`, `bg-[#240710]`, `bg-[#350A18]`, `text-[#D9A45C]`, `border-[#D9A45C]`) pelos tokens reativos do sistema: `var(--theme-bg)`, `var(--theme-surface)`, `var(--theme-surface-soft)`, `var(--theme-primary)` e `var(--theme-line)`.
   * Remova o texto literal de placeholder de IA (`[Espaço reservado para especificação do gateway de faturamento online]`) na Seção 3 da `PrivacyPolicy.tsx` e substitua por redação final limpa e profissional (*"Módulo de faturamento online em fase de implantação. Nesta versão de demonstração, nenhum dado financeiro é coletado ou processado."*).
   * Substitua os grids simétricos de "caixinhas" repetitivas na Seção 4 da `PrivacyPolicy.tsx` por uma lista tipográfica limpa com marcadores discretos em `var(--theme-primary)`.
2. **Unificação do Banner de Cookies (`CookieConsentBanner.tsx`):**
   * Remova o fundo vinho hardcoded (`bg-[#240710]/95`) e o texto de placeholder `[Espaço reservado: ...]` nos detalhes expansíveis.
   * Estilize o banner com `background: color-mix(in srgb, var(--theme-surface) 94%, transparent)`, `border: 1px solid var(--theme-line)` e botão primário usando `var(--theme-primary)` e `var(--theme-on-primary)`, garantindo harmonia total nos 3 temas.
3. **Refinamento do Tema Futurista (`theme.css`):**
   * Remova a grade fixa de `56px` em `:root[data-theme='futuristic'] body::before` e as *scanlines* repetitivas em `.site-header::after` que geram ruído visual em telas pequenas.
   * Mantenha o tema Futurista limpo, editorial e sofisticado: base escura (`#060810`), tipografia nítida, acentos ciano (`#00f0ff`) e violeta (`#c084fc`) aplicados apenas nas bordas sutis, focos e estados ativos.
4. **Blindagem de SEO da Prévia Vercel (`index.html`):**
   * Adicione `<meta name="robots" content="noindex, nofollow" />` dentro da tag `<head>` do `index.html` para evitar que o ambiente de demonstração da Vercel seja indexado pelo Google ou concorra com o site oficial do Setland.

---

### TAREFA 4: Otimização de Desempenho Mobile
- Em `InteractiveMapCanvas.tsx` e `FrostScratchOverlay.tsx`, garanta que `devicePixelRatio` seja limitado a no máximo `1.5` em viewports mobile (`window.innerWidth < 768`) para manter 60 FPS estáveis e economizar GPU.
- Garanta que `disposeObject()` limpe todas as texturas, geometrias e materiais WebGL ao desmontar `InteractiveMapCanvas`.

---

## 3. CRITÉRIOS DE ACEITE
- [ ] `npm run build` e verificação TypeScript (`tsc --noEmit`) concluídos com 0 erros.
- [ ] Hero exibe o novo botão-ticket vetorial responsivo em desktop e mobile (`380px` e `390px`) sem quebrar layout.
- [ ] Seção do Mapa 3D renderiza exclusivamente o modelo `/models/old-map.glb` (sem mesa, velas ou cilindros procedurais), com suporte à animação nativa do GLB no hover/toque e revelação do Google Maps.
- [ ] Alternar entre Default, Glacial, Medieval e Futurista atualiza harmoniosamente Home, Cardápio, Mapa, Banner de Cookies, Política de Privacidade e Termos de Uso.
- [ ] Tag `<meta name="robots" content="noindex, nofollow" />` presente no `index.html`.