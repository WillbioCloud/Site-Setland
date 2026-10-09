import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type Era = 'default' | 'glacial' | 'medieval' | 'futuristic';

const HERO_FROST = '.hero canvas.frost-scratch';

async function chooseEra(page: Page, era: Era) {
  await page.goto('/');
  await page.evaluate((value) => localStorage.setItem('setland:era', value), era);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', era);
}

/** Lets the frost loop run two frames, so the canvas shows the latest pointer input. */
function nextFrames(page: Page) {
  return page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

/** Reads the frost canvas alpha at a point given as fractions of its width and height. */
async function frostAlpha(page: Page, selector: string, at: { x: number; y: number }) {
  await nextFrames(page);
  return page
    .locator(selector)
    .first()
    .evaluate((canvas: HTMLCanvasElement, point) => {
      const context = canvas.getContext('2d');
      if (!context || canvas.width === 0) return -1;
      const x = Math.min(canvas.width - 1, Math.floor(point.x * canvas.width));
      const y = Math.min(canvas.height - 1, Math.floor(point.y * canvas.height));
      return context.getImageData(x, y, 1, 1).data[3];
    }, at);
}

/** Converts a fractional point on an element into viewport coordinates for pointer input. */
async function pointOn(page: Page, selector: string, at: { x: number; y: number }) {
  const box = await page.locator(selector).first().boundingBox();
  if (!box) throw new Error(`${selector} has no layout box`);
  return { x: box.x + box.width * at.x, y: box.y + box.height * at.y };
}

// The shared config reduces motion by default. Motion-dependent effects opt back in here.
test.describe('atmospheres with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('glacial hero freezes after a short clear window and thaws under the pointer', async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem('setland:era', 'glacial'));
    await page.goto('/');

    await expect(page.locator(HERO_FROST)).toHaveAttribute('data-frost-state', 'frozen', {
      timeout: 15000,
    });
    const hint = page.locator('.hero__frost-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('descongelar a visão');

    const farCorner = { x: 0.92, y: 0.88 };
    expect(await frostAlpha(page, HERO_FROST, farCorner)).toBeGreaterThan(200);

    const from = await pointOn(page, HERO_FROST, { x: 0.52, y: 0.4 });
    const to = await pointOn(page, HERO_FROST, { x: 0.72, y: 0.4 });
    await page.mouse.move(from.x, from.y);
    await page.mouse.move(to.x, to.y, { steps: 30 });

    expect(await frostAlpha(page, HERO_FROST, { x: 0.62, y: 0.4 })).toBeLessThan(80);
    expect(await frostAlpha(page, HERO_FROST, farCorner)).toBeGreaterThan(200);
    await expect(hint).toHaveClass(/is-hidden/);
  });

  test('frost follows touch drags and leaves vertical scrolling to the browser', async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem('setland:era', 'glacial'));
    await page.goto('/');
    await expect(page.locator(HERO_FROST)).toHaveAttribute('data-frost-state', 'frozen', {
      timeout: 15000,
    });

    const touchAction = await page
      .locator('.hero')
      .evaluate((element) => getComputedStyle(element).touchAction);
    expect(touchAction).toBe('pan-y pinch-zoom');

    // Synthetic touch pointers: horizontal drag across the hero, centre band.
    await page.locator('.hero').evaluate((hero) => {
      const rect = hero.getBoundingClientRect();
      const y = rect.top + rect.height * 0.5;
      const send = (type: string, x: number) =>
        hero.dispatchEvent(
          new PointerEvent(type, {
            clientX: x,
            clientY: y,
            pointerId: 7,
            pointerType: 'touch',
            isPrimary: true,
            bubbles: true,
          }),
        );
      send('pointerdown', rect.left + rect.width * 0.2);
      for (let step = 1; step <= 30; step++) {
        send('pointermove', rect.left + rect.width * (0.2 + step * 0.02));
      }
      send('pointerup', rect.left + rect.width * 0.8);
    });

    expect(await frostAlpha(page, HERO_FROST, { x: 0.5, y: 0.5 })).toBeLessThan(80);
    expect(await frostAlpha(page, HERO_FROST, { x: 0.92, y: 0.88 })).toBeGreaterThan(200);
  });

  test('attraction, era and menu-highlight cards carry frost and keep their clicks', async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem('setland:era', 'glacial'));
    await page.goto('/');

    await expect(page.locator('.attraction-card .frost-scratch')).toHaveCount(6);
    await expect(page.locator('.era-card .frost-scratch')).toHaveCount(3);
    await expect(page.locator('.gastronomy-visual__main .frost-scratch')).toHaveCount(1);

    const firstCard = page.locator('.attraction-card').first();
    await firstCard.scrollIntoViewIfNeeded();
    await expect(firstCard.locator('.frost-scratch')).toHaveAttribute(
      'data-frost-state',
      'frozen',
      { timeout: 15000 },
    );

    // The overlay is pointer-transparent: the element under the centre of the photo is not the canvas.
    const topElement = await firstCard.locator('.attraction-card__image').evaluate((frame) => {
      const rect = frame.getBoundingClientRect();
      const element = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      return element?.className ?? element?.tagName ?? '';
    });
    expect(String(topElement)).not.toContain('frost-scratch');

    await firstCard.locator('.attraction-card__button').click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('only the glacial atmosphere mounts frost, and snow or embers mount per era', async ({
    page,
  }) => {
    await chooseEra(page, 'default');
    await expect(page.locator('.frost-scratch')).toHaveCount(0);
    await expect(page.locator('.theme-atmosphere')).toHaveCount(0);

    await chooseEra(page, 'glacial');
    await expect(page.locator('.theme-atmosphere--snow')).toHaveCount(1);
    await expect(page.locator('.hero .frost-scratch')).toHaveCount(1);

    await chooseEra(page, 'medieval');
    await expect(page.locator('.theme-atmosphere--embers')).toHaveCount(1);
    await expect(page.locator('.frost-scratch')).toHaveCount(0);

    await chooseEra(page, 'futuristic');
    await expect(page.locator('.theme-atmosphere')).toHaveCount(0);
    await expect(page.locator('.frost-scratch')).toHaveCount(0);
  });
});

test('reduced motion removes frost, the hero hint and atmosphere from glacial', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('setland:era', 'glacial'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'glacial');
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('.frost-scratch')).toHaveCount(0);
  await expect(page.locator('.hero__frost-hint')).toHaveCount(0);
  await expect(page.locator('.theme-atmosphere')).toHaveCount(0);
});

test('an atmosphere change reaches other open tabs without a reload', async ({ page }) => {
  await page.goto('/');
  const other = await page.context().newPage();
  await other.goto('/');
  await other.evaluate(() => {
    (window as Window & { keptAlive?: boolean }).keptAlive = true;
  });

  await page.getByRole('button', { name: 'Alterar atmosfera' }).click();
  await page
    .locator('.theme-switcher__panel')
    .getByRole('button', { name: /Medieval/ })
    .click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'medieval');
  await expect(other.locator('html')).toHaveAttribute('data-theme', 'medieval', {
    timeout: 5000,
  });
  expect(await other.evaluate(() => localStorage.getItem('setland:era'))).toBe('medieval');
  expect(
    await other.evaluate(() => (window as Window & { keptAlive?: boolean }).keptAlive === true),
  ).toBe(true);
  await expect(other.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#100c08');
  await other.close();
});

test('every atmosphere keeps the home page and menu within WCAG AA', async ({ page }) => {
  test.setTimeout(240000);
  for (const era of ['default', 'glacial', 'medieval', 'futuristic'] as const) {
    for (const path of ['/', '/cardapio']) {
      await chooseEra(page, era);
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', era);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        result.violations.map((violation) => ({
          id: violation.id,
          nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 4),
        })),
        `${era} ${path}`,
      ).toEqual([]);
    }
  }
});
