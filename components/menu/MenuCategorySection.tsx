import { Crown } from 'lucide-react';
import type { MenuCategory } from '../../data/menu';
import { menuCategoryPresentation } from '../../data/menuMedia';
import { MenuItemCard } from './MenuItemCard';

interface MenuCategorySectionProps {
  category: MenuCategory;
  chapter: number;
}

export function MenuCategorySection({ category, chapter }: MenuCategorySectionProps) {
  const { id, title, items } = category;
  const presentation = menuCategoryPresentation[id];

  return (
    <section className="menu-category" id={`cat-${id}`} aria-labelledby={`heading-${id}`}>
      <div className="menu-category__header">
        <div className="menu-category__introduction">
          <span className="eyebrow">
            <span className="eyebrow-line" /> Capítulo {String(chapter).padStart(2, '0')} · Menu da
            Corte
          </span>
          <h2 id={`heading-${id}`}>{title}</h2>
          <p>{presentation.introduction}</p>
        </div>
        <span className="menu-category__count">
          {String(items.length).padStart(2, '0')}{' '}
          <span>{items.length === 1 ? 'opção' : 'opções'}</span>
        </span>
      </div>
      <div className="menu-ornament" aria-hidden="true">
        <span />
        <i />
        <Crown size={17} strokeWidth={1.1} />
        <i />
        <span />
      </div>
      <div className={`menu-items ${items.length === 1 ? 'menu-items--single' : ''}`}>
        {items.map((item) => (
          <MenuItemCard key={item.name} item={item} categoryId={id} />
        ))}
      </div>
    </section>
  );
}
