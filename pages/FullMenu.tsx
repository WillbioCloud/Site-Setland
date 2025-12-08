import React, { useState, useEffect } from 'react';
import { 
  Utensils, Pizza, Wine, Coffee, Beer, 
  GlassWater, IceCream, Beef, Grape, PartyPopper 
} from 'lucide-react';

// --- Interfaces ---
interface MenuItem {
  name: string;
  price: string;
  description?: string;
  subCategory?: string; // Para agrupar itens dentro de uma categoria (ex: Whisky, Vodka)
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
    icon: <span className="text-lg">🥖</span>,
    image: '../assets/entradas.jpg',
    items: [
      { name: 'PÃO ÁZIMO', price: 'R$ 7,77', description: 'Com manteiga de erva e caponata de berinjela.' },
    ]
  },
  {
    id: 'entradas',
    title: 'Entradas e Petiscos',
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
    icon: <span className="text-lg">🧸</span>,
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
    icon: <span className="text-lg">🍔</span>,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    items: [
      { name: 'BIG BURGUER DE FRANGO', price: 'R$ 27,77', description: 'Tirinhas de filé de frango, peito de peru, presunto, tomate, muçarela e batata frita.' },
      { name: 'X-BURGUER', price: 'R$ 27,77', description: 'Hambúrguer, cebola caramelizada, picles, 100g de queijo coalho grelhado e batata frita.' },
      { name: 'X-PICANHA', price: 'R$ 37,77', description: 'Hambúrguer de picanha, bacon, presunto, muçarela, alface, tomate e batata frita.' },
    ]
  },
  {
    id: 'pratos',
    title: 'Pratos Individuais',
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
    icon: <span className="text-lg">🥩</span>,
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
    title: 'Bovinos (2 Pessoas)',
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
    title: 'Aves (2 Pessoas)',
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
    title: 'Pizzas Mágicas (Doces)',
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
    title: 'Drinks & Coquetéis',
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

  // Rola para o topo ao montar a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const element = document.getElementById(`cat-${catId}`);
    if (element) {
      // Ajuste o offset (150px) para compensar o header fixo
      const y = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-4">
            Banquetes <span className="text-accent">Reais</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            O verdadeiro sabor da realeza. Uma seleção gastronômica digna de cavaleiros, viajantes do tempo e exploradores glaciais.
          </p>
        </div>

        {/* Category Navigation (Sticky) */}
        <div className="sticky top-24 z-40 bg-slate-950/95 backdrop-blur-md py-4 mb-12 border-b border-slate-800 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:justify-center snap-x">
            {menuData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all snap-center
                  ${activeCategory === cat.id 
                    ? 'bg-accent text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-accent hover:text-white'}
                `}
              >
                {cat.icon}
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Content */}
        <div className="space-y-24">
          {menuData.map((category) => (
            <div key={category.id} id={`cat-${category.id}`} className="scroll-mt-48 animate-slide-up">
              
              <div className="flex flex-col md:flex-row gap-8 mb-8 items-end">
                 <div className="w-full md:w-1/3">
                    <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
                        <img 
                            src={category.image} 
                            alt={category.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <h3 className="absolute bottom-4 left-6 text-3xl font-display font-bold text-white drop-shadow-md">
                            {category.title}
                        </h3>
                    </div>
                 </div>
                 <div className="w-full md:w-2/3 pb-4">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-24"></div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {category.items.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-bold text-white text-lg tracking-wide group-hover:text-accent transition-colors">
                        {item.name}
                      </span>
                      
                      {/* Dotted Line */}
                      <div className="flex-1 mx-4 border-b-2 border-dotted border-slate-700 h-1 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      
                      <span className="font-bold text-accent text-lg whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-slate-500 text-sm font-light leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p className="mb-2">* Imagens meramente ilustrativas.</p>
            <p>Se beber, não dirija. Venda proibida para menores de 18 anos.</p>
            <p className="mt-4 text-accent/50 italic">Cobramos taxa de serviço de 10% (opcional).</p>
        </div>

      </div>
    </section>
  );
};