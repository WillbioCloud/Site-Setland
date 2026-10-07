import type { MenuCategoryId, MenuItem } from './menu';
import couvert from '../assets/optimized/entradas.webp';
import mignon from '../assets/mignon-parmegiana.webp';
import suinos from '../assets/suinos.webp';
import espumantes from '../assets/optimized/espumantes.webp';
import ice from '../assets/blue-background.webp';
import carnes from '../assets/menu/carnes-nobres.webp';
import panelinhas from '../assets/menu/panelinhas.webp';
import petiscos from '../assets/menu/petiscos.webp';
import hamburgueres from '../assets/menu/hamburgueres.webp';
import massas from '../assets/menu/massas.webp';
import aves from '../assets/menu/aves.webp';
import peixes from '../assets/menu/peixes.webp';
import pizzas from '../assets/menu/pizzas-medievais.webp';
import forno from '../assets/menu/pizzas-forno.webp';
import pizzasDoces from '../assets/menu/pizzas-doces.webp';
import sobremesas from '../assets/menu/sobremesas.webp';
import drinks from '../assets/menu/drinks.webp';
import vinhos from '../assets/menu/vinhos.webp';
import destilados from '../assets/menu/destilados.webp';
import bebidas from '../assets/menu/sucos.webp';
import refrigerantes from '../assets/menu/refrigerantes.webp';
import cervejas from '../assets/menu/cervejas.webp';

export interface MenuPhoto {
  src: string;
  alt: string;
  position?: string;
}

export interface MenuPhotoSource extends MenuPhoto {
  usage: 'dish' | 'category' | 'atmosphere';
}

export interface MenuCategoryPresentation {
  image: MenuPhoto;
  fallback: MenuPhoto;
  badge: string;
  introduction: string;
  priceLabel: string;
  tone?: 'ice';
}

/** Local files only: the catalog does not depend on third-party image uptime. */
export const menuPhotos = {
  couvert: { src: couvert, alt: 'Pães e acompanhamentos à mesa', position: '50% 58%' },
  mignon: {
    src: mignon,
    alt: 'Filé mignon à parmegiana com queijo gratinado',
    position: '50% 50%',
  },
  suinos: { src: suinos, alt: 'Leitão assado com ervas e acompanhamentos', position: '50% 42%' },
  espumantes: { src: espumantes, alt: 'Seleção de espumantes Casa Perini', position: '50% 60%' },
  ice: { src: ice, alt: 'Cristais de gelo em uma ambientação glacial', position: '50% 50%' },
  carnes: { src: carnes, alt: 'Carne grelhada com batatas e ervas', position: '65% 52%' },
  panelinhas: {
    src: panelinhas,
    alt: 'Panelinha de arroz gratinado servida à mesa',
    position: '50% 43%',
  },
  petiscos: { src: petiscos, alt: 'Porção de batatas fritas com molhos', position: '50% 60%' },
  hamburgueres: {
    src: hamburgueres,
    alt: 'Hambúrguer com queijo, carne e salada',
    position: '50% 50%',
  },
  massas: { src: massas, alt: 'Espaguete ao molho de tomate com manjericão', position: '50% 57%' },
  aves: { src: aves, alt: 'Panela com pedaços de frango e legumes', position: '50% 50%' },
  peixes: { src: peixes, alt: 'Peixe servido com grãos e vegetais', position: '50% 47%' },
  pizzas: { src: pizzas, alt: 'Pizza assada com queijo, tomate e ervas', position: '50% 53%' },
  forno: { src: forno, alt: 'Pizza fatiada com queijo e vegetais', position: '50% 58%' },
  pizzasDoces: { src: pizzasDoces, alt: 'Pizza doce com chocolate e banana', position: '50% 43%' },
  sobremesas: {
    src: sobremesas,
    alt: 'Sobremesa de chocolate e sorvete em taça',
    position: '50% 58%',
  },
  drinks: { src: drinks, alt: 'Coquetéis e acessórios de bar', position: '25% 50%' },
  vinhos: { src: vinhos, alt: 'Seleção de garrafas de vinho Casa Perini', position: '50% 47%' },
  destilados: { src: destilados, alt: 'Garrafa de whisky e copos com gelo', position: '50% 50%' },
  bebidas: {
    src: bebidas,
    alt: 'Suco de laranja servido em um copo com frutas',
    position: '50% 60%',
  },
  refrigerantes: {
    src: refrigerantes,
    alt: 'Latas de refrigerante sobre gelo',
    position: '50% 50%',
  },
  cervejas: { src: cervejas, alt: 'Caneca de cerveja com espuma', position: '50% 42%' },
} satisfies Record<string, MenuPhoto>;

/** Exhaustive by design: a new category must receive real media and a local fallback. */
export const menuCategoryPresentation: Record<MenuCategoryId, MenuCategoryPresentation> = {
  couvert: {
    image: menuPhotos.couvert,
    fallback: menuPhotos.petiscos,
    badge: 'Menu da Corte',
    introduction: 'Um convite à mesa. Comece sua experiência pelos pequenos detalhes.',
    priceLabel: 'Valor do couvert',
  },
  entradas: {
    image: menuPhotos.petiscos,
    fallback: menuPhotos.couvert,
    badge: 'Para compartilhar',
    introduction: 'Petiscos, porções e encontros que merecem uma boa companhia.',
    priceLabel: 'Valor da porção',
  },
  kids: {
    image: menuPhotos.massas,
    fallback: menuPhotos.couvert,
    badge: 'Pequenos nobres',
    introduction: 'Uma pausa saborosa para os pequenos aventureiros da corte.',
    priceLabel: 'Menu infantil',
  },
  hamburguer: {
    image: menuPhotos.hamburgueres,
    fallback: menuPhotos.petiscos,
    badge: 'Banquete entre pães',
    introduction: 'Escolha seu hambúrguer e aproveite cada pausa da aventura.',
    priceLabel: 'Valor do hambúrguer',
  },
  pratos: {
    image: menuPhotos.mignon,
    fallback: menuPhotos.carnes,
    badge: 'Da Realeza',
    introduction: 'Pratos individuais para saborear no seu próprio ritmo.',
    priceLabel: 'Prato individual',
  },
  panelinhas: {
    image: menuPhotos.panelinhas,
    fallback: menuPhotos.aves,
    badge: 'Tradição do Cerrado',
    introduction: 'Sabores que se encontram na panela. Uma experiência feita para dividir.',
    priceLabel: 'Serve duas pessoas',
  },
  executivos: {
    image: menuPhotos.carnes,
    fallback: menuPhotos.mignon,
    badge: 'À mesa da Corte',
    introduction: 'Escolha o seu prato e reencontre os sabores de uma boa refeição.',
    priceLabel: 'Prato executivo',
  },
  carnes: {
    image: menuPhotos.carnes,
    fallback: menuPhotos.mignon,
    badge: 'Da Realeza',
    introduction: 'Cortes nobres e acompanhamentos para um banquete de boas histórias.',
    priceLabel: 'Valor do prato',
  },
  suinos: {
    image: menuPhotos.suinos,
    fallback: menuPhotos.carnes,
    badge: 'O sabor da tradição',
    introduction: 'Assados, grelhados e acompanhamentos que convidam a ficar à mesa.',
    priceLabel: 'Valor do prato',
  },
  bovinos: {
    image: menuPhotos.carnes,
    fallback: menuPhotos.mignon,
    badge: 'Banquete para dois',
    introduction: 'Pratos para duas pessoas. Porque compartilhar também faz parte da experiência.',
    priceLabel: 'Serve duas pessoas',
  },
  aves: {
    image: menuPhotos.aves,
    fallback: menuPhotos.massas,
    badge: 'Menu da Corte',
    introduction: 'Pratos com frango e acompanhamentos, preparados para compartilhar.',
    priceLabel: 'Serve duas pessoas',
  },
  'frutos-mar': {
    image: menuPhotos.peixes,
    fallback: menuPhotos.carnes,
    badge: 'Do mar à mesa',
    introduction: 'Peixes, camarões e combinações que ampliam a sua viagem de sabores.',
    priceLabel: 'Valor do prato',
  },
  pizzas: {
    image: menuPhotos.pizzas,
    fallback: menuPhotos.forno,
    badge: 'Fornada da Corte',
    introduction: 'Nomes que contam histórias. Escolha sua pizza e descubra cada combinação.',
    priceLabel: 'Pizza média',
  },
  'pizzas-doces': {
    image: menuPhotos.pizzasDoces,
    fallback: menuPhotos.forno,
    badge: 'Doce encantamento',
    introduction: 'Um final doce para a sua história, uma fatia de cada vez.',
    priceLabel: 'Pizza média',
  },
  sobremesas: {
    image: menuPhotos.sobremesas,
    fallback: menuPhotos.pizzasDoces,
    badge: 'Doces da Corte',
    introduction: 'Mais um motivo para prolongar os bons momentos à mesa.',
    priceLabel: 'Valor da sobremesa',
  },
  drinks: {
    image: menuPhotos.drinks,
    fallback: menuPhotos.destilados,
    badge: 'Um brinde à aventura',
    introduction: 'Coquetéis e encontros. Escolha o sabor do seu próximo brinde.',
    priceLabel: 'Valor do coquetel',
  },
  espumantes: {
    image: menuPhotos.espumantes,
    fallback: menuPhotos.vinhos,
    badge: 'Celebre como a Realeza',
    introduction: 'Borbulhas para acompanhar as ocasiões que merecem ser celebradas.',
    priceLabel: 'Valor do item',
  },
  vinhos: {
    image: menuPhotos.vinhos,
    fallback: menuPhotos.espumantes,
    badge: 'Adega da Corte',
    introduction: 'Vinhos e taças para brindar e acompanhar sua escolha do cardápio.',
    priceLabel: 'Valor do item',
  },
  destilados: {
    image: menuPhotos.destilados,
    fallback: menuPhotos.drinks,
    badge: 'Seleção da Corte',
    introduction: 'Explore os rótulos da carta e consulte a equipe sobre o serviço.',
    priceLabel: 'Valor do item',
  },
  bebidas: {
    image: menuPhotos.bebidas,
    fallback: menuPhotos.ice,
    badge: 'Uma pausa glacial',
    tone: 'ice',
    introduction: 'Sucos, águas e refrigerantes para refrescar a pausa entre uma era e outra.',
    priceLabel: 'Valor da bebida',
  },
  cervejas: {
    image: menuPhotos.cervejas,
    fallback: menuPhotos.drinks,
    badge: 'Brindes da Corte',
    introduction: 'Escolha seu rótulo e brinde aos momentos vividos no Setland.',
    priceLabel: 'Valor da bebida',
  },
};

const reference = (photo: MenuPhoto): MenuPhotoSource => ({ ...photo, usage: 'category' });
const dish = (photo: MenuPhoto): MenuPhotoSource => ({ ...photo, usage: 'dish' });

/** Exact names avoid collisions between the same dish in individual and sharing categories. */
const itemPhotos: Partial<Record<MenuCategoryId, Record<string, MenuPhotoSource>>> = {
  couvert: { 'PÃO ÁZIMO': dish(menuPhotos.couvert) },
  kids: {
    ESPAGUETE: reference(menuPhotos.massas),
    'PEITO DE FRANGO': reference(menuPhotos.aves),
    'FILÉ MIGNON': reference(menuPhotos.carnes),
  },
  pratos: {
    'FILÉ MIGNON À PARMEGIANA': dish(menuPhotos.mignon),
    'FILÉ DE TILÁPIA REAL': reference(menuPhotos.peixes),
    'PICANHA NA CHAPA': reference(menuPhotos.carnes),
  },
  executivos: {
    'BISTECA SUÍNA': reference(menuPhotos.suinos),
    'FRANGO GRELHADO': reference(menuPhotos.aves),
    'FILÉ DE TILÁPIA': reference(menuPhotos.peixes),
  },
  suinos: { 'LEITÃO ASSADO COM ERVAS': dish(menuPhotos.suinos) },
  bovinos: { 'PARMEGIANA DE FILÉ MIGNON': dish(menuPhotos.mignon) },
  bebidas: {
    'ÁGUA SEM GÁS': { ...menuPhotos.ice, usage: 'atmosphere' },
    'ÁGUA COM GÁS': { ...menuPhotos.ice, usage: 'atmosphere' },
    H2OH: { ...menuPhotos.ice, usage: 'atmosphere' },
    'COCA COLA KS': reference(menuPhotos.refrigerantes),
    'REFRIGERANTE EM LATA': reference(menuPhotos.refrigerantes),
    'SUCO DE UVA TINTO (CASA PERINI 300ML)': reference(menuPhotos.bebidas),
    'SUCO DE UVA BRANCO (CASA PERINI 300ML)': reference(menuPhotos.bebidas),
  },
};

export function getMenuPhotoSources(categoryId: MenuCategoryId, item: MenuItem): MenuPhotoSource[] {
  const category = menuCategoryPresentation[categoryId];
  const sources: MenuPhotoSource[] = [
    itemPhotos[categoryId]?.[item.name] ?? reference(category.image),
    reference(category.image),
    category.fallback.src === menuPhotos.ice.src
      ? { ...category.fallback, usage: 'atmosphere' }
      : reference(category.fallback),
  ];
  return sources.filter(
    (source, index) => sources.findIndex((other) => other.src === source.src) === index,
  );
}
