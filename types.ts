export type ThemeEra = 'glacial' | 'medieval' | 'futuristic';

export interface Attraction {
  id: string;
  name: string;
  category: 'kids' | 'radical' | 'scenery';
  description: string;
  imageUrl: string;
  era: ThemeEra;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'lanches' | 'bebidas' | 'refeicoes';
  imageUrl: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}
