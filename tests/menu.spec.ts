import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { menuData, type MenuCategory } from '../data/menu';
import { displayMenuName, getMenuItemAnchor, normalizeMenuSearch } from '../data/menuDisplay';

const original = JSON.parse(
  readFileSync(new URL('./fixtures/menu-original.json', import.meta.url), 'utf8'),
) as Pick<MenuCategory, 'id' | 'title' | 'items'>[];
const originalItems = original.flatMap((category) => category.items);

test('menu data exactly matches the original inventory, not only its count', () => {
  expect(menuData.map(({ id, title, items }) => ({ id, title, items }))).toEqual(original);
  expect(originalItems).toHaveLength(124);
  expect(normalizeMenuSearch('  TRADIÇÃO DO CERRADO  ')).toBe('tradicao do cerrado');
  expect(getMenuItemAnchor('pratos', 'FILÉ MIGNON À PARMEGIANA')).toBe(
    'item-pratos-file-mignon-a-parmegiana',
  );
});

test('every item has its complete title over a full-width photograph and its original price below', async ({
  page,
}) => {
  await page.goto('/cardapio');
  await expect(page.locator('.menu-item')).toHaveCount(124);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator('.menu-item__heading h3').allTextContents()).toEqual(
    originalItems.map((item) => displayMenuName(item.name)),
  );
  expect(await page.locator('.menu-item__price').allTextContents()).toEqual(
    originalItems.map((item) => item.price),
  );

  const layoutIssues = await page.locator('.menu-item').evaluateAll((cards) =>
    cards.flatMap((card) => {
      const media = card.querySelector<HTMLElement>('.menu-item__media')!;
      const image = card.querySelector<HTMLImageElement>('.menu-item__image')!;
      const title = card.querySelector<HTMLElement>('h3')!;
      const badge = card.querySelector<HTMLElement>('.menu-item__badge')!;
      const body = card.querySelector<HTMLElement>('.menu-item__body')!;
      const price = card.querySelector<HTMLElement>('.menu-item__price')!;
      const m = media.getBoundingClientRect();
      const t = title.getBoundingClientRect();
      const b = badge.getBoundingClientRect();
      const i = image.getBoundingClientRect();
      const content = body.getBoundingClientRect();
      const p = price.getBoundingClientRect();
      const valid =
        image.getAttribute('src') &&
        getComputedStyle(image).objectFit === 'cover' &&
        Math.abs(i.width - m.width) < 2 &&
        Math.abs(i.height - m.height) < 2 &&
        getComputedStyle(title.parentElement!).position === 'absolute' &&
        t.top >= b.bottom + 3 &&
        t.bottom <= m.bottom &&
        t.left >= m.left &&
        t.right <= m.right &&
        content.top >= m.bottom - 1 &&
        p.top >= content.top &&
        p.bottom <= content.bottom &&
        getComputedStyle(price).color === 'rgb(203, 169, 110)';
      return valid
        ? []
        : [
            {
              item: title.textContent,
              imageWidth: i.width,
              mediaWidth: m.width,
              titleTop: t.top,
              badgeBottom: b.bottom,
            },
          ];
    }),
  );
  expect(layoutIssues).toEqual([]);
});

test('primary categories use local culinary photos and identify category references', async ({
  page,
}) => {
  await page.goto('/cardapio');
  for (const [category, file] of [
    ['panelinhas', 'panelinhas'],
    ['carnes', 'carnes-nobres'],
    ['pizzas', 'pizzas-medievais'],
    ['drinks', 'drinks'],
    ['espumantes', 'espumantes'],
    ['cervejas', 'cervejas'],
  ]) {
    const card = page.locator(`#cat-${category} .menu-item`).first();
    await card.scrollIntoViewIfNeeded();
    const image = card.locator('img');
    await expect(image).toHaveAttribute('src', new RegExp(file));
    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    expect(new URL((await image.getAttribute('src')) ?? '', page.url()).origin).toBe(
      new URL(page.url()).origin,
    );
    await expect(card.locator('.menu-item__photo-label')).toHaveText('Imagem de referência');
  }
  const mignon = page.locator('#item-pratos-file-mignon-a-parmegiana');
  await expect(mignon.locator('img')).toHaveAttribute('src', /mignon-parmegiana/);
  await expect(mignon.locator('.menu-item__photo-label')).toHaveText('Foto do acervo');
  await expect(page.locator('#item-bebidas-suco-natural-400ml img')).toHaveAttribute(
    'src',
    /sucos/,
  );
});

test('failed primary photos use a category fallback without removing the title or price', async ({
  page,
}) => {
  await page.route('**/assets/menu/panelinhas.webp', (route) => route.abort());
  await page.goto('/cardapio#cat-panelinhas');
  const card = page.locator('#item-panelinhas-panelinha-goiana-setland');
  await expect(card.locator('.menu-item__media')).toHaveAttribute('data-photo-state', 'fallback');
  await expect(card.locator('img')).toHaveAttribute('src', /aves/);
  await expect
    .poll(() => card.locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth > 0))
    .toBe(true);
  await expect(card.getByRole('heading')).toHaveText('Panelinha goiana setland');
  await expect(card.locator('.menu-item__price')).toHaveText('R$ 77,77');
});

test('even a double image failure leaves the item readable without an error retry loop', async ({
  page,
}) => {
  let failedRequests = 0;
  await page.route('**/assets/menu/{panelinhas,aves}.webp', (route) => {
    failedRequests++;
    return route.abort();
  });
  await page.goto('/cardapio#cat-panelinhas');
  const card = page.locator('#item-panelinhas-panelinha-goiana-setland');
  await expect(card.locator('.menu-item__media')).toHaveAttribute(
    'data-photo-state',
    'unavailable',
  );
  await expect(card.locator('img')).toHaveCount(0);
  await expect(card.locator('.menu-item__photo-label')).toHaveText('Imagem indisponível');
  await expect(card.getByRole('heading')).toBeVisible();
  await expect(card.locator('.menu-item__price')).toHaveText('R$ 77,77');
  expect(failedRequests).toBeLessThan(25);
});

test('search includes thematic labels, preserves complete descriptions and returns to the results', async ({
  page,
}) => {
  await page.goto('/cardapio#cat-cervejas');
  const search = page.getByRole('searchbox', { name: 'Buscar no cardápio' });
  await search.fill('tradicao do cerrado');
  await expect(page.locator('.menu-category')).toHaveCount(1);
  await expect(page.locator('.menu-item')).toHaveCount(3);
  await expect(page.locator('#cat-panelinhas')).toBeVisible();
  await expect
    .poll(async () => (await page.locator('#cat-panelinhas').boundingBox())!.y)
    .toBeGreaterThan(165);
  await expect
    .poll(async () => (await page.locator('#cat-panelinhas').boundingBox())!.y)
    .toBeLessThan(290);
  const descriptions = original
    .find((category) => category.id === 'panelinhas')!
    .items.map((item) => item.description);
  expect(await page.locator('.menu-item__description').allTextContents()).toEqual(descriptions);
  await search.fill('cortes nobres');
  await expect(page.locator('.menu-category')).toHaveCount(1);
  await expect(page.locator('#heading-carnes')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar busca', exact: true }).click();
  await expect(page.locator('.menu-item')).toHaveCount(124);
});

test('home highlights and item deep links arrive at the requested photographed dish', async ({
  page,
}) => {
  await page.route('https://res.cloudinary.com/**', (route) => route.abort());
  await page.goto('/');
  await page.locator('.menu-highlight').filter({ hasText: 'Mignon à parmegiana' }).click();
  await expect(page).toHaveURL('/cardapio#item-pratos-file-mignon-a-parmegiana');
  const card = page.locator('#item-pratos-file-mignon-a-parmegiana');
  await expect(card.getByRole('heading')).toBeVisible();
  await expect.poll(async () => (await card.boundingBox())!.y).toBeGreaterThan(170);
  await expect.poll(async () => (await card.boundingBox())!.y).toBeLessThan(300);
  await page.reload();
  await expect(card.locator('.menu-item__price')).toHaveText('R$ 57,77');
  await expect.poll(async () => (await card.boundingBox())!.y).toBeLessThan(300);
});

test('category anchors remain highlighted with the responsive sticky-header offset', async ({
  page,
}) => {
  for (const width of [768, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/cardapio#cat-panelinhas');
    const nav = page.getByRole('navigation', { name: 'Categorias do cardápio' });
    await expect(nav.getByRole('link', { name: /Panelinhas/ })).toHaveAttribute(
      'aria-current',
      'location',
    );
    await nav.getByRole('link', { name: /Carnes Nobres/ }).click();
    await expect(page).toHaveURL('/cardapio#cat-carnes');
    await expect(nav.getByRole('link', { name: /Carnes Nobres/ })).toHaveAttribute(
      'aria-current',
      'location',
    );
  }
});
