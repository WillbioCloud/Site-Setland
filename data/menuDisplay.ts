import type { MenuCategoryId } from './menu';

export function normalizeMenuSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

export function getMenuItemAnchor(categoryId: MenuCategoryId, name: string): string {
  const slug = normalizeMenuSearch(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `item-${categoryId}-${slug}`;
}

export function displayMenuName(name: string): string {
  return name.charAt(0) + name.slice(1).toLocaleLowerCase('pt-BR');
}
