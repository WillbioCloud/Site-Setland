# Fotografias e referências do cardápio

As imagens desta pasta são arquivos WebP locais. O site não faz requisições a bancos de imagens para exibir o cardápio. Os arquivos originais de `/assets` permanecem preservados.

## Como a interface distingue as imagens

- **Foto do acervo**: arquivo já existente em `/assets`, mapeado explicitamente para o prato correspondente (pão ázimo, mignon à parmegiana e leitão).
- **Imagem de referência**: fotografia representativa da categoria. Não é uma afirmação de que a foto retrata exatamente o prato servido no Setland.
- **Ambientação temática**: fundo glacial original do projeto, usado quando não há fotografia específica, como nas águas.

Não havia fotografias individuais dos 124 itens. O catálogo original trazia sobretudo URLs externas por categoria, algumas indisponíveis ou referentes a outro tipo de prato. Essas referências foram recuperadas quando identificáveis e complementadas onde necessário. A imagem de peixe que estava associada a Panelinhas no código antigo, por exemplo, agora aparece entre os peixes; Panelinhas tem uma referência de uma panela de arroz.

## Origens

| Arquivo | Origem / referência | Observação |
| --- | --- | --- |
| `pizzas-medievais.webp` | [Unsplash — photo-1513104890138-7c749659a591](https://images.unsplash.com/photo-1513104890138-7c749659a591) | Referência original de Pizzas; recuperada a partir da [cópia indexada](https://pizzafactorytt.com/). |
| `pizzas-forno.webp` | [Unsplash — photo-1565299624946-b28f40a0ae38](https://images.unsplash.com/photo-1565299624946-b28f40a0ae38) | Referência original; usada como fallback fotográfico de pizzas. |
| `carnes-nobres.webp` | [Unsplash — photo-1600891964092-4316c288032e](https://images.unsplash.com/photo-1600891964092-4316c288032e) | Referência original de Carnes Nobres. |
| `peixes.webp` | [Unsplash — photo-1547592180-85f173990554](https://images.unsplash.com/photo-1547592180-85f173990554) | Referência original, remapeada para peixes por representar uma preparação de peixe. |
| `hamburgueres.webp` | [Unsplash — photo-1568901346375-23c9450c58cd](https://images.unsplash.com/photo-1568901346375-23c9450c58cd) | Referência original de Hambúrgueres. |
| `aves.webp` | [Unsplash — photo-1604908176997-125f25cc6f3d](https://images.unsplash.com/photo-1604908176997-125f25cc6f3d) | Referência original de Aves; recuperada da [cópia indexada](https://meatthermometer.org/wireless). |
| `cervejas.webp` | [Unsplash — photo-1608270586620-248524c67de9](https://images.unsplash.com/photo-1608270586620-248524c67de9) | Referência original de Cervejas. |
| `refrigerantes.webp` | [Unsplash — photo-1622483767028-3f66f32aef97](https://images.unsplash.com/photo-1622483767028-3f66f32aef97) | Referência original, remapeada apenas para refrigerantes. |
| `vinhos.webp` | [Casa Perini / Werle Comercial](https://werlecomercial.com.br/box-vinhos-casa-perini-brinde) | Família de garrafas da referência original `c7brcxede6st35n8forpayrybxuf1po2dhax`. |
| `sobremesas.webp` | [Unsplash — photo-1563805042-7684c019e1cb](https://images.unsplash.com/photo-1563805042-7684c019e1cb) | Referência original de Sobremesas. |
| `drinks.webp` | [Coleção de bebidas — Magnific](https://magnific.com/br/fotos/bebidas-mesa) | Referência de coquetéis da mesma coleção visual do URL anterior; fotografia `23-2148673765`. |
| `destilados.webp` | [Bartender Store](https://bartenderstore.com.br/whiskey-sour-o-coquetel-que-mistura-o-doce-e-o-azedo) | Referência de garrafa e copos com gelo do provedor já usado no projeto. |
| `panelinhas.webp` | [Campo Grande News — Panelinha goiana](https://www.campograndenews.com.br/lado-b/sabor/sem-miseria-na-receita-panelinha-goiana-sacia-a-fome-de-qualquer-um) | Referência complementar por categoria, não foto do prato Setland. |
| `petiscos.webp` | [Unsplash — RVIWSj7n1pw](https://unsplash.com/photos/a-white-bowl-filled-with-french-fries-next-to-a-dipping-sauce-RVIWSj7n1pw) | Referência complementar de porção de batatas. |
| `massas.webp` | [Unsplash — photo-1713949215217-8ce60dfc93e7](https://images.unsplash.com/photo-1713949215217-8ce60dfc93e7) | Referência complementar para o espaguete do menu infantil. |
| `sucos.webp` | [Pexels — foto 5668181](https://images.pexels.com/photos/5668181/pexels-photo-5668181.jpeg) | Referência complementar de suco de laranja. |
| `pizzas-doces.webp` | [Vitat — pizza doce](https://vitat.com.br/receitas/3048-pizza-doce---chocolate-preto,-branco-e-banana) | Referência complementar da categoria de pizzas doces. |

As fontes estão registradas para rastreabilidade, não como cessão de direitos. Antes de uma publicação comercial, confirme as permissões de uso das referências externas ou substitua-as por fotografias próprias do parque.

## Manutenção

O mapeamento está em `data/menuMedia.ts`, separado dos nomes, descrições e preços de `data/menu.ts`. Cada uma das 21 categorias tem uma imagem e um fallback local; mapeamentos por nome de item têm prioridade. O tipo `Record<MenuCategoryId, MenuCategoryPresentation>` impede adicionar uma categoria sem definir sua apresentação.

Para trocar por uma fotografia própria, substitua o arquivo correspondente ou cadastre a foto em `itemPhotos` com `usage: 'dish'`. Nunca marque imagens genéricas como fotografias de um prato específico. Badges são temáticas: não são usadas alegações de popularidade como “Mais pedido” sem dados que as sustentem.
