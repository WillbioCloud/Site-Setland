import { memo, useState } from 'react';
import { Crown } from 'lucide-react';
import { displayMenuName, getMenuItemAnchor } from '../../data/menuDisplay';
import type { MenuCategoryId, MenuItem } from '../../data/menu';
import { getMenuPhotoSources, menuCategoryPresentation } from '../../data/menuMedia';

interface MenuItemCardProps {
  item: MenuItem;
  categoryId: MenuCategoryId;
}

/** A complete menu item: photo and title above, original description and price below. */
export const MenuItemCard = memo(function MenuItemCard({ item, categoryId }: MenuItemCardProps) {
  const presentation = menuCategoryPresentation[categoryId];
  const sources = getMenuPhotoSources(categoryId, item);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const photo = sources[Math.min(photoIndex, sources.length - 1)];
  const id = getMenuItemAnchor(categoryId, item.name);
  const titleId = `${id}-title`;

  const handlePhotoError = () => {
    if (photoIndex < sources.length - 1) setPhotoIndex(photoIndex + 1);
    else setUnavailable(true);
  };

  const imageLabel = unavailable
    ? 'Imagem indisponível'
    : photo.usage === 'dish'
      ? 'Foto do acervo'
      : photo.usage === 'atmosphere'
        ? 'Ambientação temática'
        : 'Imagem de referência';

  return (
    <article
      className={`menu-item ${presentation.tone === 'ice' ? 'menu-item--ice' : ''}`}
      id={id}
      aria-labelledby={titleId}
    >
      <div
        className="menu-item__media"
        data-photo-state={unavailable ? 'unavailable' : photoIndex > 0 ? 'fallback' : 'primary'}
        data-photo-usage={photo.usage}
      >
        {!unavailable && (
          <img
            className="menu-item__image"
            src={photo.src}
            alt={
              photo.usage === 'dish'
                ? photo.alt
                : `Imagem de referência: ${photo.alt.toLocaleLowerCase('pt-BR')}`
            }
            width="800"
            height="450"
            style={{ objectPosition: photo.position ?? '50% 50%' }}
            loading="lazy"
            decoding="async"
            onError={handlePhotoError}
          />
        )}
        <div className="menu-item__shade" aria-hidden="true" />
        <span className="menu-item__badge">
          <Crown size={13} strokeWidth={1.3} aria-hidden="true" />
          {presentation.badge}
        </span>
        <div className="menu-item__heading" data-long-title={item.name.length > 36}>
          <h3 id={titleId}>{displayMenuName(item.name)}</h3>
        </div>
      </div>
      <div className="menu-item__body">
        <p
          className={`menu-item__description ${item.description ? '' : 'menu-item__description--note'}`}
        >
          {item.description ?? 'Consulte a apresentação e a disponibilidade com a equipe.'}
        </p>
        <div className="menu-item__footer">
          <div className="menu-item__price-block">
            <span>{presentation.priceLabel}</span>
            <strong className="menu-item__price">{item.price}</strong>
          </div>
          <span className="menu-item__photo-label">{imageLabel}</span>
        </div>
      </div>
    </article>
  );
});
