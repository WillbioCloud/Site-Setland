import { Castle, Orbit, Snowflake } from 'lucide-react';
import type { Attraction, ThemeEra } from '../types';
import glacial from '../assets/optimized/glacial.webp';
import gelo1 from '../assets/optimized/gelo-1.webp';
import gelo2 from '../assets/optimized/gelo-2.webp';
import gelo3 from '../assets/optimized/gelo-3.webp';
import medieval from '../assets/optimized/vila-medieval.webp';
import combate from '../assets/optimized/combate-sabre.webp';
import guilhotina from '../assets/optimized/guilhotina.webp';
import playground from '../assets/optimized/playground.webp';
import futuristic from '../assets/optimized/robo.webp';
import castle from '../assets/optimized/castelo.webp';

export const HERO_VIDEO_URL =
  'https://res.cloudinary.com/dxplpg36m/video/upload/v1765849320/V%C3%ADdeo_Drone_Castelo_Setland_Gerado_emeqwk.mp4';
export const CASTLE_IMAGE = castle;
export const INSTAGRAM_URL = 'https://www.instagram.com/7setland/';
export const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Setland+Caldas+Novas+GO';

export const eras = [
  {
    id: 'glacial' as ThemeEra,
    number: '01',
    name: 'Era Glacial',
    shortName: 'Glacial',
    icon: Snowflake,
    tagline: 'Sinta o extraordinário',
    summary: 'Um reino de gelo. Uma experiência de arrepiar.',
    description:
      'O frio ganha um novo significado no Parque de Gelo. Explore os cenários, descubra esculturas e encontre personagens em uma experiência a −17 °C, bem no coração de Caldas Novas.',
    image: glacial,
    imageAlt: 'Personagens do Setland entre esculturas e cenários de gelo',
    badge: '−17 °C',
    features: [
      'Parque de Gelo a −17 °C',
      'Casacos higienizados para a experiência',
      'Cenários e encontros com personagens',
    ],
    gallery: [
      { src: gelo1, alt: 'Personagem ao lado da carruagem de gelo' },
      { src: gelo2, alt: 'Encontro com personagens no Parque de Gelo' },
      { src: gelo3, alt: 'Cenário iluminado no interior do Parque de Gelo' },
    ],
  },
  {
    id: 'medieval' as ThemeEra,
    number: '02',
    name: 'Era Medieval',
    shortName: 'Medieval',
    icon: Castle,
    tagline: 'Entre para a história',
    summary: 'Castelos, personagens e histórias que ganham vida.',
    description:
      'Deixe o presente do lado de fora das muralhas. Caminhe pela vila medieval, conheça os cenários do castelo e acompanhe apresentações que transformam a visita em uma história para contar.',
    image: medieval,
    imageAlt: 'Vila medieval do Setland iluminada à noite',
    badge: 'Uma viagem no tempo',
    features: [
      'Vila e cenários medievais',
      'Apresentações teatrais',
      'Experiências para compartilhar em família',
    ],
    gallery: [
      { src: medieval, alt: 'Casas e poço da vila medieval' },
      { src: guilhotina, alt: 'Visitante participando da atração Guilhotina' },
      { src: castle, alt: 'Muralhas e torres do castelo Setland' },
    ],
  },
  {
    id: 'futuristic' as ThemeEra,
    number: '03',
    name: 'Era Futurística',
    shortName: 'Futurística',
    icon: Orbit,
    tagline: 'Descubra o que vem depois',
    summary: 'Luzes, tecnologia e um novo jeito de imaginar.',
    description:
      'Do outro lado do tempo, a imaginação encontra novos caminhos. Luzes, ambientações futurísticas e personagens robóticos convidam você a explorar um universo diferente dentro do Setland.',
    image: futuristic,
    imageAlt: 'Personagem robótico em um ambiente futurístico com iluminação azul',
    badge: 'Outro universo',
    features: [
      'Ambientação futurística',
      'Luzes e cenários imersivos',
      'Encontros e registros inesquecíveis',
    ],
    gallery: [
      { src: futuristic, alt: 'Personagem robótico do Setland' },
      { src: combate, alt: 'Apresentação com sabres iluminados' },
    ],
  },
];

export type ParkAttraction = Attraction & { badge: string; detail: string };

export const attractions: ParkAttraction[] = [
  {
    id: '1',
    name: 'Parque de Gelo',
    category: 'scenery',
    era: 'glacial',
    imageUrl: glacial,
    badge: '−17 °C',
    description: 'O frio que você nunca imaginou sentir em Caldas Novas.',
    detail:
      'Entre em um universo de esculturas e cenários de gelo. A experiência acontece a −17 °C, com casacos higienizados disponibilizados pelo parque. Consulte a equipe sobre orientações e condições de acesso.',
  },
  {
    id: '2',
    name: 'Playground',
    category: 'kids',
    era: 'glacial',
    imageUrl: playground,
    badge: 'Para os pequenos',
    description: 'Um pequeno castelo para grandes descobertas.',
    detail:
      'Uma miniatura do castelo de gelo pensada para as brincadeiras dos pequenos. Acompanhe as crianças durante a visita e consulte no local as orientações de idade e uso dos brinquedos.',
  },
  {
    id: '3',
    name: 'Vila Medieval',
    category: 'scenery',
    era: 'medieval',
    imageUrl: medieval,
    badge: 'Cenário imersivo',
    description: 'Cada caminho leva a uma nova história.',
    detail:
      'Passeie por uma vila com casas, objetos e cenários de inspiração medieval. Reserve um tempo para observar os detalhes e registrar as lembranças da sua viagem pelo tempo.',
  },
  {
    id: '4',
    name: 'Guilhotina',
    category: 'radical',
    era: 'medieval',
    imageUrl: guilhotina,
    badge: 'Teste sua coragem',
    description: 'Uma dose de suspense dentro das muralhas.',
    detail:
      'Um encontro com o lado mais misterioso da era medieval, em uma experiência cenográfica. Siga as instruções dos monitores e consulte as condições de participação no local.',
  },
  {
    id: '5',
    name: 'Combate de Sabres',
    category: 'radical',
    era: 'medieval',
    imageUrl: combate,
    badge: 'Teatro ao vivo',
    description: 'A história ganha vida bem diante dos seus olhos.',
    detail:
      'Personagens, coreografias e sabres iluminados transformam o cenário em palco. As apresentações seguem a programação do parque; confirme os horários com a equipe no dia da visita.',
  },
  {
    id: '6',
    name: 'Laboratório Neon',
    category: 'scenery',
    era: 'futuristic',
    imageUrl: futuristic,
    badge: 'Experiência imersiva',
    description: 'Uma passagem para um universo de possibilidades.',
    detail:
      'Explore a ambientação futurística, as luzes e os personagens do Laboratório Neon. Um cenário diferente para despertar a curiosidade e guardar novas lembranças da visita.',
  },
];
