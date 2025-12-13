import React, { useState, useEffect, useRef } from 'react';
import { 
  Utensils, Pizza, Wine, Beer, 
  GlassWater, IceCream, Beef, PartyPopper,
  ChevronLeft, ChevronRight, Zap, Snowflake, Crown,
  Wheat, Smile, Sandwich, Ham, Drumstick, Fish, Candy, Martini,
  Coffee, ShoppingBag
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// --- Interfaces ---
interface MenuItem {
  name: string;
  price: string;
  description?: string;
  subCategory?: string;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  image: string;
  items: MenuItem[];
}


// --- Dados Completos do Cardápio ---
const menuData: MenuCategory[] = [
  {
    id: 'couvert',
    title: 'Couvert',
    icon: <Wheat size={18} />,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9674c96b?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'PÃO ÁZIMO', price: 'R$ 7,77', description: 'Com manteiga de erva e caponata de berinjela.' },
    ]
  },
  {
    id: 'entradas',
    title: 'Entradas',
    icon: <Utensils size={18} />,
    image: 'https://images.unsplash.com/photo-1621857426350-ddab819cf0cc?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'FRITAS SIMPLES', price: 'R$ 22,77' },
      { name: 'FRITAS COM QUEIJO MUÇARELA', price: 'R$ 27,77' },
      { name: 'FRITAS ESPECIAIS', price: 'R$ 37,77', description: 'Com bacon e creme de cheddar.' },
      { name: 'PASTÉIS (6 UNIDADES)', price: 'R$ 37,77', description: 'Carne e queijo.' },
      { name: 'QUIBE DE CUPIM (6 UNIDADES)', price: 'R$ 47,77', description: 'Recheado com queijo.' },
      { name: 'SALAMINHO', price: 'R$ 47,77', description: 'Com palmito e tomate.' },
      { name: 'SALADA CAESAR', price: 'R$ 47,77', description: 'Alface americana, croutons, filé de frango, parmesão ralado e molho especial.' },
      { name: 'QUEIJO COALHO GRELHADO (300g)', price: 'R$ 57,77', description: 'Com mel de abelha.' },
      { name: 'DADINHO DE QUEIJO EMPANADO (300g)', price: 'R$ 57,77' },
      { name: 'SALADA NA CESTA', price: 'R$ 57,77', description: 'Cestinha de queijo parmesão, alface americana, filé mignon grelhado, palmito, tomate e queijo coalho grelhado.' },
      { name: 'CUBOS DE FILÉ DE TILÁPIA EMPANADO (400g)', price: 'R$ 67,77' },
      { name: 'CEVICHE DE TILÁPIA', price: 'R$ 67,77', description: 'Pimenta dedo de moça, suco de limão, pimenta do reino, salsa, cebola roxa e azeite.' },
      { name: 'TÁBUA DO MAR', price: 'R$ 137,77', description: 'Filé de tilápia grelhada, camarões, brócolis, tomate cereja, alcaparras, azeitona verde.' },
    ]
  },
  {
    id: 'kids',
    title: 'Menu Kids',
    icon: <Smile size={18} />,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'ESPAGUETE', price: 'R$ 24,77', description: 'Ao molho bolonhesa e queijo.' },
      { name: 'PEITO DE FRANGO', price: 'R$ 27,77', description: 'Tiras grelhadas com arroz e fritas.' },
      { name: 'FILÉ MIGNON', price: 'R$ 37,77', description: 'Tiras grelhadas com arroz e fritas.' },
    ]
  },
  {
    id: 'hamburguer',
    title: 'Hambúrgueres',
    icon: <Sandwich size={18} />,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'BIG BURGUER DE FRANGO', price: 'R$ 27,77', description: 'Tirinhas de filé de frango, peito de peru, presunto, tomate, muçarela e batata frita.' },
      { name: 'X-BURGUER', price: 'R$ 27,77', description: 'Hambúrguer, cebola caramelizada, picles, 100g de queijo coalho grelhado e batata frita.' },
      { name: 'X-PICANHA', price: 'R$ 37,77', description: 'Hambúrguer de picanha, bacon, presunto, muçarela, alface, tomate e batata frita.' },
    ]
  },
  {
    id: 'pratos',
    title: 'Individuais',
    icon: <Utensils size={18} />,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'FILÉ DE FRANGO À PARMEGIANA', price: 'R$ 47,77', description: 'Filé empanado, arroz branco e legumes na manteiga.' },
      { name: 'FILÉ DE TILÁPIA REAL', price: 'R$ 57,77', description: 'Filé de tilápia, arroz branco e legumes na manteiga.' },
      { name: 'FILÉ MIGNON À PARMEGIANA', price: 'R$ 57,77', description: 'Filé mignon empanado, arroz branco e legumes na manteiga.' },
      { name: 'PICANHA NA CHAPA', price: 'R$ 67,77', description: 'Picanha grill, pão de alho, arroz branco e feijão tropeiro.' },
    ]
  },
  {
    id: 'panelinhas',
    title: 'Panelinhas',
    icon: <span className="text-lg">🥘</span>,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'PANELINHA GOIANA SETLAND', price: 'R$ 77,77', description: 'Arroz filé de frango, linguiça suína, guariroba, pequi, pimenta de cheiro, tomate, muçarela e banana frita. (Serve duas pessoas.)' },
      { name: 'PANELINHA MISTA', price: 'R$ 77,77', description: 'Tiras de filé mignon, tiras de frango, cebola, tomate, muçarela, queijo parmesão e cheiro verde. (Serve duas pessoas.)' },
      { name: 'PANELINHA DE CAMARÃO', price: 'R$ 157,77', description: 'Arroz, camarão, presunto em cubos, ervilha fresca, pimentão vermelho, pimentão amarelo, molho especial, muçarela e batata palha. (Serve duas pessoas.)' },
    ]
  },
  {
    id: 'executivos',
    title: 'Executivos',
    icon: <span className="text-lg">💼</span>,
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?q=80&w=800&auto=format&fit=crop',
    items: [
        { name: 'BISTECA SUÍNA', price: 'R$ 47,77', description: 'Arroz, feijão tropeiro, salada e fritas.' },
        { name: 'FRANGO GRELHADO', price: 'R$ 47,77', description: 'Arroz, feijão tropeiro, salada e fritas.' },
        { name: 'FILÉ DE TILÁPIA', price: 'R$ 57,77', description: 'Arroz, feijão tropeiro, salada e fritas.' },
        { name: 'CONTRA FILÉ', price: 'R$ 57,77', description: 'Arroz, feijão tropeiro, salada e fritas.' },
    ]
  },
  {
    id: 'carnes',
    title: 'Carnes Nobres',
    icon: <Ham size={18} />,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
    items: [
        { name: 'BIFE ANCHO ANGUS', price: 'R$ 147,77', description: 'Legumes assados, abóbora, batata, banana da terra, batata doce e risoto de tomate seco.' },
        { name: 'BOMBOM DE ALCATRA', price: 'R$ 147,77', description: 'Arroz branco, feijão tropeiro, pão de alho, banana grelhada, mandioca na manteiga e vinagrete.' },
        { name: 'T-BONE', price: 'R$ 147,77', description: 'Arroz de alho, farofa de maracujá, legumes assados, abóbora, batata, banana da terra, batata doce e vinagrete.' },
    ]
  },
  {
    id: 'suinos',
    title: 'Suínos',
    icon: <span className="text-lg">🥓</span>,
    image: '../assets/suinos.jpg',
    items: [
      { name: 'LEITÃO ASSADO COM ERVAS', price: 'R$ 127,77', description: 'Arroz branco, mandioca frita, legumes assados, abóbora, batata, banana da terra, batata doce, farofa brasil e vinagrete.' },
      { name: 'COSTELINHA SUÍNA', price: 'R$ 127,77', description: 'Arroz branco, batata frita, farofa brasil, vinagrete e molho barbecue.' },
      { name: 'PICANHA SUÍNA GRILL', price: 'R$ 137,77', description: 'Arroz biro biro, pão de alho, feijão tropeiro, banana grelhada e vinagrete.' },
    ]
  },
  {
    id: 'bovinos',
    title: 'Bovinos (2P)',
    icon: <Beef size={18} />,
    image: 'https://images.unsplash.com/photo-1558030006-47906773d19d?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'FILÉ MIGNON', price: 'R$ 147,77', description: 'Arroz de alho, farofa de maracujá, legumes assados, abóbora, batata, banana da terra, batata doce e vinagrete.' },
      { name: 'PICANHA NA CHAPA', price: 'R$ 167,77', description: 'Arroz branco, feijão tropeiro, pão de alho, banana grelhada, mandioca na manteiga e vinagrete.' },
      { name: 'FILÉ 3 PIMENTAS', price: 'R$ 147,77', description: 'Molho demi glacê com: Pimenta do reino, pimenta rosa e pimenta malagueta, arroz a grega e batata frita.' },
      { name: 'FILÉ MEDALHÃO SETLAND', price: 'R$ 147,77', description: 'Arroz piamontese, batatas rústicas, molho madeira e champignon.' },
      { name: 'PARMEGIANA DE FILÉ MIGNON', price: 'R$ 137,77', description: 'Arroz branco e batata frita.' },
    ]
  },
  {
    id: 'aves',
    title: 'Aves (2P)',
    icon: <span className="text-lg">🍗</span>,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'PARMEGIANA DE FILÉ DE FRANGO', price: 'R$ 97,77', description: 'Arroz branco e batata frita.' },
      { name: 'FILÉ DE FRANGO COM MOLHO BECHAMEL', price: 'R$ 97,77', description: 'Filé a milanesa, molho branco gratinado com queijo, arroz de brócolis e batata frita.' },
    ]
  },
  {
    id: 'frutos-mar',
    title: 'Frutos do Mar',
    icon: <span className="text-lg">🦐</span>,
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'SALMÃO AO MOLHO DE ALCAPARRAS', price: 'R$ 157,77', description: 'Arroz de castanha, batata rústica, molho de alcaparras com champignon e salada.' },
      { name: 'SALMÃO AO MOLHO DE MARACUJÁ', price: 'R$ 157,77', description: 'Arroz cremoso, molho de maracujá, batata rústica e salada.' },
      { name: 'SALMÃO AO MOLHO PESTO', price: 'R$ 157,77', description: 'Arroz cremoso, molho pesto, batata rústica e salada.' },
      { name: 'FILÉ DE TILÁPIA A BELLE MEUNIERE', price: 'R$ 147,77', description: 'Filé grelhado com molho de camarão, alcaparras, champignon, batata rústica e arroz branco.' },
      { name: 'PAELLA', price: 'R$ 167,77', description: 'Arroz, pintado, camarão, lula, polvo, lombo suíno, peito de frango, ervilha fresca e molho especial.' },
    ]
  },
  {
    id: 'pizzas',
    title: 'Pizzas Medievais',
    icon: <Pizza size={18} />,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'SETLAND', price: 'R$ 77,77', description: 'Cordeiro assado ao molho de vinho, muçarela e molho pesto. (MÉDIA). GRANDE: R$ 87,77.' },
      { name: 'ARIEL', price: 'R$ 117,77', description: 'Camarão, champignon, palmito, alho poró, requeijão cremoso, muçarela e tomate seco. (MÉDIA). GRANDE: R$ 137,77.' },
      { name: 'DOROTHY', price: 'R$ 67,77', description: 'Carne seca desfiada, pimentão, muçarela, requeijão, tomate, cebola e azeitona. (MÉDIA). GRANDE: R$ 77,77.' },
      { name: 'PIRATA', price: 'R$ 67,77', description: 'Lombo canadense, muçarela, azeitona preta, queijo prato, e tomate cereja. (MÉDIA). GRANDE: R$ 77,77.' },
      { name: 'CARRASCO', price: 'R$ 67,77', description: 'Frango, guariroba, pequi, jiló, milho e pimentas. (MÉDIA). GRANDE: R$ 77,77.' },
      { name: 'CHAPELEIRO MALUCO', price: 'R$ 67,77', description: 'Presunto, frango desfiado, ervilha, tomate, palmito, azeitona, muçarela e bacon. (MÉDIA). GRANDE: R$ 77,77.' },
      { name: 'VALENTE', price: 'R$ 57,77', description: 'Muçarela, calabresa, cebola e azeitona. (MÉDIA). GRANDE: R$ 67,77.' },
      { name: 'ZORRO', price: 'R$ 57,77', description: 'Presunto, ovo, cebola, pimentão, azeitona, muçarela e tomate seco. (MÉDIA). GRANDE: R$ 67,77.' },
      { name: 'SETINHO', price: 'R$ 57,77', description: 'Frango desfiado, requeijão cremoso, palmito e muçarela. (MÉDIA). GRANDE: R$ 67,77.' },
      { name: 'OLAF', price: 'R$ 57,77', description: 'Queijo muçarela, queijo prato, requeijão cremoso e gorgonzola. (MÉDIA). GRANDE: R$ 67,77.' },
    ]
  },
  {
    id: 'pizzas-doces',
    title: 'Pizzas Mágicas',
    icon: <PartyPopper size={18} />,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'REI E RAINHA', price: 'R$ 67,77', description: 'Muçarela, chocolate, castanha de caju e cereja. (MÉDIA). GRANDE: R$ 77,77.' },
      { name: 'BRANCA DE NEVE', price: 'R$ 57,77', description: 'Muçarela, doce de leite, banana e paçoca. (MÉDIA). GRANDE: R$ 67,77.' },
      { name: 'A BELA E A FERA', price: 'R$ 57,77', description: 'Muçarela, goiabada cremosa e creme de leite. (MÉDIA). GRANDE: R$ 67,77.' },
    ]
  },
  {
    id: 'sobremesas',
    title: 'Sobremesas',
    icon: <IceCream size={18} />,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'TAÇA DE SORVETE', price: 'R$ 17,77', description: 'Sabores: chocolate, creme e morango.' },
      { name: 'PETIT GATEAU', price: 'R$ 27,77', description: 'Servido com sorvete de creme.' },
      { name: 'COCADA DE FORNO', price: 'R$ 27,77', description: 'Servido com sorvete de creme.' },
    ]
  },
  {
    id: 'drinks',
    title: 'Drinks',
    icon: <span className="text-lg">🍹</span>,
    image: 'https://images.unsplash.com/photo-1536935338788-843bb6d8d992?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'COQUETEL DE FRUTAS SEM ÁLCOOL', price: 'R$ 18,77' },
      { name: 'CAIPIRINHA', price: 'R$ 15,77', description: 'Velho barreiro, limão, gelo e açúcar.' },
      { name: 'MEIA DE SEDA', price: 'R$ 22,77', description: 'Creme de leite, vodka e licor de cacau.' },
      { name: 'ALEXANDER', price: 'R$ 22,77', description: 'Conhaque, licor de chocolate, creme de leite e canela em pó.' },
      { name: 'PINA COLADA', price: 'R$ 22,77', description: 'Bacardi branco, abacaxi, leite de coco, leite condensado e canela em pó.' },
      { name: 'CAIPIROSKA (Smirnoff)', price: 'R$ 22,77', description: 'Smirnoff, limão, gelo e açúcar.' },
      { name: 'CAIPIRÍSSIMA', price: 'R$ 22,77', description: 'Bacardi, limão, gelo e açúcar.' },
      { name: 'CAIPIROSKA DE FRUTAS TROPICAIS (Smirnoff)', price: 'R$ 23,77', description: 'Smirnoff, frutas tropicais, gelo e açúcar.' },
      { name: 'DRY MARTINI', price: 'R$ 23,77', description: 'Gin, vermute, azeitona e gelo.' },
      { name: 'CAIPIRINHA DE SHAKE', price: 'R$ 24,77', description: 'Shake gerkeikan, limão, gelo e açúcar.' },
      { name: 'CAIPIROSKA (Stolichnaya)', price: 'R$ 25,77', description: 'Stolichnaya, limão, gelo e açúcar.' },
      { name: 'CAIPIROSKA DE FRUTAS TROPICAIS (Stolichnaya)', price: 'R$ 27,77', description: 'Stolichnaya, frutas tropicais, gelo e açúcar.' },
    ]
  },
  {
    id: 'espumantes',
    title: 'Espumantes',
    icon: <PartyPopper size={20} />,
    image: '../assets/espumantes.png',
    items: [
      { name: 'BRUT CASA PERINI', price: 'R$ 77,77' },
      { name: 'PROSECCO CASA PERINI', price: 'R$ 87,77' },
      { name: 'MOSCATEL CASA PERINI', price: 'R$ 87,77' },
      { name: 'ROSÉ BRUT CASA PERINI', price: 'R$ 77,77' },
      { name: 'AQUARELA MOSCATEL CASA PERINI', price: 'R$ 77,77' },
    ]
  },
  {
    id: 'vinhos',
    title: 'Vinhos',
    icon: <Wine size={18} />,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'CASA PERINI BARBERA', price: 'R$ 107,77' },
      { name: 'CASA PERINI ARTE MARSELAN', price: 'R$ 107,77' },
      { name: 'CASA PERINI TERROIS MALBEC', price: 'R$ 107,77' },
      { name: 'CASA PERINI FRAÇÃO ÚNICA PINOT', price: 'R$ 107,77' },
      { name: 'CASA PERINI FRAÇÃO ÚNICA CABERNET MERLOT', price: 'R$ 107,77' },
      { name: 'CASA PERINI FRAÇÃO ÚNICA CABERNET SAUVIGNON', price: 'R$ 107,77' },
      { name: 'CASA PERINI FRAÇÃO ÚNICA CHARDONNAY (BRANCO)', price: 'R$ 107,77' },
      { name: 'CASA PERINI ROSÉ SOLIDÁRIO (ROSADO)', price: 'R$ 107,77' },
      { name: 'TAÇA TINTO SUAVE', price: 'R$ 17,77' },
      { name: 'TAÇA BRANCO SECO', price: 'R$ 17,77' },
      { name: 'TAÇA CABERNET SAUVIGNON', price: 'R$ 20,77' },
    ]
  },
  {
    id: 'destilados',
    title: 'Destilados',
    icon: <span className="text-lg">🥃</span>,
    image: '../assets/destilados.jpg',
    items: [
      { name: 'OLD PAR (Whisky)', price: 'R$ 20,77' },
      { name: 'JACK DANIELS (Whisky)', price: 'R$ 20,77' },
      { name: 'JHONNY WALKER RED (Whisky)', price: 'R$ 17,77' },
      { name: 'JHONNY WALKER BLACK (Whisky)', price: 'R$ 20,32' },
      { name: 'SMIRNOFF (Vodka)', price: 'R$ 12,77' },
      { name: 'STOLICHNAYA RUSSA (Vodka)', price: 'R$ 16,77' },
      { name: 'SEAGERS (Gin)', price: 'R$ 12,77' },
      { name: 'TANQUERAY (Gin)', price: 'R$ 16,77' },
      { name: 'SHAKE GERKKEIKAN', price: 'R$ 14,77' },
      { name: 'BACARDI CARTA BRANCA', price: 'R$ 12,77' },
      { name: 'MARTINI BIANCO', price: 'R$ 12,77' },
      { name: 'MARTINI EXTRA DRY', price: 'R$ 12,77' },
      { name: 'SCHLICHTE (STEINHAGER)', price: 'R$ 17,77' },
      { name: 'SALINAS (CACHAÇA)', price: 'R$ 12,77' },
      { name: 'VELHO BARREIRO (CACHAÇA)', price: 'R$ 7,77' },
      { name: 'LICOR 43', price: 'R$ 19,77' },
      { name: 'LICOR BAILEYS', price: 'R$ 16,77' },
      { name: 'LICOR COINTREAU', price: 'R$ 16,77' },
    ]
  },
  {
    id: 'bebidas',
    title: 'Bebidas e Sucos',
    icon: <GlassWater size={18} />,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'ÁGUA SEM GÁS', price: 'R$ 3,77' },
      { name: 'ÁGUA COM GÁS', price: 'R$ 4,77' },
      { name: 'H2OH', price: 'R$ 7,77' },
      { name: 'COCA COLA KS', price: 'R$ 5,77' },
      { name: 'REFRIGERANTE EM LATA', price: 'R$ 6,77' },
      { name: 'SUCO NATURAL 400ML', price: 'R$ 10,77', description: 'Laranja, Abacaxi, Morango e Limão.' },
      { name: 'SUCO DE POLPA 400ML', price: 'R$ 9,77', description: 'Acerola, Caju, Goiaba, Cajá, Maracujá, Graviola e Abacaxi.' },
      { name: 'SUCO DE UVA TINTO (CASA PERINI 300ML)', price: 'R$ 12,77' },
      { name: 'SUCO DE UVA BRANCO (CASA PERINI 300ML)', price: 'R$ 12,77' },
    ]
  },
  {
    id: 'cervejas',
    title: 'Cervejas',
    icon: <Beer size={18} />,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'BRAHMA DUPLO MALTE (600ml)', price: 'R$ 14,77' },
      { name: 'HEINEKEN (600ml)', price: 'R$ 18,77' },
      { name: 'HEINEKEN (Long Neck)', price: 'R$ 10,77' },
      { name: 'PETRA (Long Neck)', price: 'R$ 10,77' },
    ]
  }
];

export const FullMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('couvert');
  const { currentTheme } = useTheme();
  
  // Refs para controle de scroll e drag
  const navRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Rola para o topo ao carregar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Handlers de Drag (Mouse) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - navRef.current.offsetLeft);
    setScrollLeft(navRef.current.scrollLeft);
    // Não seta isDragging true imediatamente para permitir clique
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    // Pequeno delay para garantir que o clique funcione se foi rápido
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do scroll
    
    // Só considera "arrastar" se moveu mais de 5 pixels
    if (Math.abs(walk) > 5) {
        setIsDragging(true);
        navRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // --- Navegação por Setas ---
  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
        const amount = 300;
        navRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (catId: string) => {
    if (isDragging) return; // Se estiver arrastando, ignora o clique
    setActiveCategory(catId);
    const element = document.getElementById(`cat-${catId}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // --- LÓGICA DE TEMAS ---
  const isFuture = currentTheme === 'futuristic';
  const isMedieval = currentTheme === 'medieval';
  const isGlacial = currentTheme === 'glacial';

  return (
    <section className={`pt-32 pb-20 min-h-screen w-full overflow-x-hidden transition-colors duration-700 
      ${isFuture ? 'bg-black' : isMedieval ? 'bg-[#1a110d] parchment-texture' : isGlacial ? 'bg-slate-900' : 'bg-slate-950'}`}>
      
      {/* CSS Injetado */}
      <style>{`
        .striped-text {
          background-image: repeating-linear-gradient(180deg, #fff 0, #fff 1px, transparent 2px, transparent 4px);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 8px rgba(0, 243, 255, 0.7);
        }
        .neon-box {
          box-shadow: 0 0 5px #00f3ff, inset 0 0 10px rgba(0, 243, 255, 0.2);
        }
        .icon-neon {
            filter: drop-shadow(0 0 3px #00f3ff);
            color: #00f3ff;
        }
        .hide-scroll::-webkit-scrollbar {
            display: none;
        }
        .hide-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      <div className="container mx-auto px-4 max-w-full overflow-hidden">
        
        {/* HEADER DO CARDÁPIO */}
        <div className="text-center mb-12 animate-fade-in px-2">
          {isFuture ? (
            <div className="inline-block transform -skew-x-6 md:-skew-x-12 border-2 border-[#00f3ff] p-4 md:p-6 bg-black/80 neon-box max-w-full">
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black italic striped-text font-future m-0 tracking-tighter break-words">
                  FOOD_SYSTEM
                </h2>
                <div className="flex justify-between items-center mt-2 border-t border-[#00f3ff]/50 pt-2">
                    <span className="text-[#00f3ff] font-mono text-[10px] md:text-xs">SYS.READY</span>
                    <span className="text-[#ff00ff] font-bold text-xs md:text-sm transform skew-x-6 md:skew-x-12">V.3.0</span>
                </div>
            </div>
          ) : (
            <>
                <h2 className={`text-4xl md:text-6xl font-black mb-4 
                  ${isMedieval ? 'font-medieval text-[#5c4033] drop-shadow-sm' : 'font-display text-white'}`}>
                  {isMedieval ? 'O Banquete Real' : isGlacial ? 'Sabores do Gelo' : 'Cardápio SetLand'}
                </h2>
                <p className={`text-lg max-w-2xl mx-auto 
                   ${isMedieval ? 'text-[#8b5e3c] font-serif italic' : isGlacial ? 'text-cyan-100' : 'text-slate-400'}`}>
                   {isMedieval ? 'Iguarias preparadas pelos melhores cozinheiros do reino.' : 'Recupere suas energias para a próxima aventura.'}
                </p>
            </>
          )}
        </div>

        {/* --- NAVEGAÇÃO DE CATEGORIAS (STICKY & DRAGGABLE) --- */}
        <div className={`sticky top-20 z-40 py-4 mb-16 transition-all backdrop-blur-md border-y w-screen -ml-4 px-4
            ${isFuture ? 'bg-black/90 border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 
              isMedieval ? 'bg-[#f5e6d3]/95 border-[#5c4033] shadow-md' : 
              'bg-slate-900/90 border-white/10'
            }
        `}>
          <div className="relative max-w-7xl mx-auto flex items-center">
            
            {/* Seta Esquerda (Apenas Desktop) */}
            <button onClick={() => scrollNav('left')} className={`hidden md:block p-2 rounded-full transition z-10 
                ${isFuture ? 'text-[#00f3ff] hover:bg-[#00f3ff]/20' : 
                  isMedieval ? 'text-[#5c4033] hover:bg-[#5c4033]/10' : 
                  'text-white hover:bg-white/20'}`}>
                <ChevronLeft size={32} />
            </button>

            {/* Lista Scrollável */}
            <div 
                ref={navRef}
                className="flex gap-4 overflow-x-auto hide-scroll scroll-smooth px-4 w-full cursor-grab active:cursor-grabbing select-none py-2"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
              {menuData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 font-bold transition-all duration-300 text-sm md:text-base
                    ${isFuture 
                        ? `uppercase font-future tracking-widest border border-[#00f3ff] skew-x-[-10deg]
                           ${activeCategory === cat.id ? 'bg-[#00f3ff] text-black shadow-[0_0_15px_#00f3ff]' : 'text-[#00f3ff] bg-transparent hover:bg-[#00f3ff]/10'}`
                        : isMedieval
                        ? `rounded-lg font-medieval tracking-wider border-2
                           ${activeCategory === cat.id ? 'bg-[#5c4033] text-[#f5e6d3] border-[#5c4033]' : 'bg-transparent text-[#5c4033] border-[#5c4033]/50 hover:border-[#5c4033]'}`
                        : `rounded-full whitespace-nowrap 
                           ${activeCategory === cat.id ? 'bg-accent text-slate-900 scale-105 shadow-lg' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-accent hover:text-white'}`
                    }
                  `}
                >
                  <span className={`${isFuture ? "transform skew-x-[10deg] flex items-center" : "flex items-center"}`}>
                    {/* Renderiza o ícone com classe neon se for futurista, senão ícone normal */}
                    <span className={`${isFuture ? 'icon-neon mr-2' : 'mr-2'}`}>
                        {cat.icon}
                    </span>
                    <span>{isFuture ? cat.title.toUpperCase() : cat.title}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Seta Direita (Apenas Desktop) */}
            <button onClick={() => scrollNav('right')} className={`hidden md:block p-2 rounded-full transition z-10 
                ${isFuture ? 'text-[#00f3ff] hover:bg-[#00f3ff]/20' : 
                  isMedieval ? 'text-[#5c4033] hover:bg-[#5c4033]/10' : 
                  'text-white hover:bg-white/20'}`}>
                <ChevronRight size={32} />
            </button>
          </div>
        </div>

        {/* --- CONTEÚDO --- */}
        <div className="space-y-32 max-w-6xl mx-auto pb-12">
          {menuData.map((category) => (
            <div key={category.id} id={`cat-${category.id}`} className="scroll-mt-64">
              
              {/* --- LAYOUT FUTURISTA (CYBERPUNK) --- */}
              {isFuture ? (
                <div className="relative border-2 border-[#00f3ff] bg-black/90 p-1 mb-8 shadow-[0_0_20px_rgba(0,243,255,0.15)] mx-2 md:mx-0">
                    {/* Cantoneiras */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[#ff00ff] z-10"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[#ff00ff] z-10"></div>

                    {/* Cabeçalho */}
                    <div className="bg-[#00f3ff]/10 p-4 md:p-6 border-b border-[#00f3ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 border border-[#00f3ff] bg-black icon-neon">
                                {category.icon}
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black font-future italic text-white striped-text tracking-widest break-all">
                                {category.title.toUpperCase()}
                            </h3>
                        </div>
                        <div className="hidden md:flex gap-1">
                            {[1,2,3].map(i => <div key={i} className={`w-8 h-2 bg-[#00f3ff] opacity-${i*30}`}></div>)}
                        </div>
                    </div>

                    {/* Itens Grid */}
                    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-[linear-gradient(0deg,rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]">
                        {category.items.map((item, idx) => (
                            <div key={idx} className="group relative pl-4 hover:pl-6 transition-all duration-300">
                                {/* Marcador lateral */}
                                <div className="absolute left-0 top-1 w-1 h-full bg-[#333] group-hover:bg-[#ff00ff] transition-colors"></div>
                                
                                <div className="flex justify-between items-baseline border-b border-dashed border-[#333] pb-2 group-hover:border-[#00f3ff]/50">
                                    <span className="text-[#00f3ff] font-future tracking-wider text-base md:text-lg group-hover:text-white transition-colors">
                                        {item.name}
                                    </span>
                                    <span className="text-white font-mono text-lg md:text-xl drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] whitespace-nowrap ml-2">
                                        {item.price}
                                    </span>
                                </div>
                                {item.description && (
                                    <p className="text-gray-500 text-[10px] md:text-xs font-mono mt-1 uppercase tracking-tight">{item.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
              ) : (
                
              /* --- LAYOUT PADRÃO / MEDIEVAL / GLACIAL --- */
                <div className="animate-slide-up">
                    <div className="flex flex-col md:flex-row gap-8 mb-10 items-end">
                        <div className="w-full md:w-1/3 px-4 md:px-0">
                            <div className={`relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-2xl group border-4
                                ${isMedieval ? 'border-[#5c4033] rounded-b-lg' : isGlacial ? 'border-cyan-400/50 rounded-2xl' : 'border-slate-700 rounded-2xl'}`}>
                                <img src={category.image} alt={category.title} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isMedieval ? 'sepia-[.4]' : ''}`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                                    <h3 className={`text-2xl md:text-3xl font-bold text-white 
                                        ${isMedieval ? 'font-medieval tracking-[0.2em] text-[#fbbf24] drop-shadow-md' : 'font-display'}`}>
                                        {category.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-2/3 px-2">
                            {/* Decorator Line */}
                            <div className={`h-1 w-full mb-8 rounded-full ${isMedieval ? 'bg-[#5c4033]' : 'bg-slate-800'}`}></div>
                            
                            <div className="grid grid-cols-1 gap-y-6">
                                {category.items.map((item, idx) => (
                                <div key={idx} className="group flex flex-col">
                                    <div className="flex items-baseline justify-between">
                                        <span className={`font-bold text-lg md:text-xl tracking-wide transition-colors
                                            ${isMedieval ? 'text-[#451a03] font-medieval' : 'text-slate-100'}`}>
                                            {item.name}
                                        </span>
                                        
                                        {/* Linha pontilhada conectora */}
                                        <div className={`flex-1 mx-2 md:mx-4 border-b-2 border-dotted mb-1 opacity-40
                                            ${isMedieval ? 'border-[#5c4033]' : 'border-white'}`}></div>
                                        
                                        <span className={`font-bold text-lg md:text-xl whitespace-nowrap
                                            ${isMedieval ? 'text-[#854d0e] font-serif' : 'text-accent'}`}>
                                            {item.price}
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className={`text-xs md:text-sm mt-1
                                            ${isMedieval ? 'text-[#5c4033]/80 italic font-serif' : 'text-slate-400'}`}>
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className={`mt-32 pt-12 border-t text-center text-sm opacity-60
            ${isFuture ? 'border-[#00f3ff] text-[#00f3ff] font-mono' : isMedieval ? 'border-[#5c4033] text-[#5c4033]' : 'border-slate-800 text-slate-500'}`}>
            <p className="mb-2">* Imagens meramente ilustrativas.</p>
            <p>Se beber, não dirija. Venda proibida para menores de 18 anos.</p>
            <p className="mt-4 italic">Cobramos taxa de serviço de 10% (opcional).</p>
        </div>

      </div>
    </section>
  );
};