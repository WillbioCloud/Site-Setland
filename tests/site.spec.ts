import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const videoURL =
  'https://res.cloudinary.com/dxplpg36m/video/upload/v1765849320/V%C3%ADdeo_Drone_Castelo_Setland_Gerado_emeqwk.mp4';

async function home(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Uma viagem');
}
async function openTickets(page: Page) {
  await page.getByRole('button', { name: 'Ingressos', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}
async function advanceVisit(page: Page) {
  await page.getByLabel('Data da visita', { exact: true }).fill('2026-10-08');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.getByLabel('Nome completo')).toBeVisible();
}
async function customerDetails(page: Page) {
  await page.getByLabel('Nome completo').fill('Pessoa de Teste');
  await page.getByLabel('E-mail', { exact: true }).fill('visita@example.com');
}

// These tests do not depend on Cloudinary availability, trigger real payments, or send personal data.
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-07T15:00:00Z'));
  await page.route('https://res.cloudinary.com/**', (route) => route.abort());
});

test('hero uses the requested video, real poster and respects reduced motion', async ({ page }) => {
  await home(page);
  const video = page.locator('.hero__video');
  await expect(video).toHaveAttribute('src', videoURL);
  expect(
    await video.evaluate((element: HTMLVideoElement) => ({
      loop: element.loop,
      muted: element.muted,
      inline: element.playsInline,
      paused: element.paused,
      autoplay: element.autoplay,
    })),
  ).toEqual({ loop: true, muted: true, inline: true, paused: true, autoplay: false });
  await expect(page.locator('.hero__poster')).toBeVisible();
  await expect(page.locator('canvas, iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reproduzir vídeo de fundo' }).click();
  await expect(video).toHaveCount(0);
  await expect(page.locator('.hero__poster')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('film fails gracefully and closes with Escape', async ({ page }) => {
  await home(page);
  const trigger = page.getByRole('button', { name: 'Assistir ao filme sobre o Setland' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByText('O filme está indisponível no momento.', { exact: false }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('three eras keep focus, cycle content and hand off to the ticket planner', async ({
  page,
}) => {
  await home(page);
  const trigger = page.getByRole('button', { name: 'Explorar Era Glacial', exact: true });
  await trigger.click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Era Glacial', exact: true }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'glacial');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await trigger.click();
  await page.getByRole('button', { name: 'Explorar próxima era' }).click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Era Medieval', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Planejar visita', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: 'Planeje sua visita.', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('attraction filters retain all six attractions and useful details', async ({ page }) => {
  await home(page);
  await expect(page.locator('.attraction-card')).toHaveCount(6);
  const filters = page.getByRole('group', { name: 'Filtrar atrações' });
  await filters.getByRole('button', { name: 'Para os pequenos' }).click();
  await expect(page.locator('.attraction-card')).toHaveCount(1);
  await expect(page.locator('.attraction-card')).toContainText('Playground');
  await expect(page.locator('.result-count')).toHaveText('1 experiência');
  await filters.getByRole('button', { name: 'Aventura & emoção' }).click();
  await expect(page.locator('.attraction-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Conhecer Combate de Sabres', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('confirme os horários');
  await page.keyboard.press('Escape');
  await filters.getByRole('button', { name: 'Todas as experiências' }).click();
  await expect(page.locator('.attraction-card')).toHaveCount(6);
});

test('theme preferences persist through reloads and both routes without a 3D embed', async ({
  page,
}) => {
  await home(page);
  for (const [label, value] of [
    ['Glacial', 'glacial'],
    ['Medieval', 'medieval'],
    ['Futurística', 'futuristic'],
  ] as const) {
    await page.getByRole('button', { name: 'Alterar atmosfera' }).click();
    await page
      .locator('.theme-switcher__panel')
      .getByRole('button', { name: new RegExp(label) })
      .click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', value);
    await expect(page.locator('canvas, iframe')).toHaveCount(0);
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'futuristic');
  await page.goto('/cardapio');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('sabores');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'futuristic');
  await page.getByRole('button', { name: 'Alterar atmosfera' }).click();
  await page
    .locator('.theme-switcher__panel')
    .getByRole('button', { name: 'Atmosfera original' })
    .click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'default');
});

test('FAQ works with mouse, keyboard and announced expanded states', async ({ page }) => {
  await home(page);
  const first = page.getByRole('button', { name: /Qual é o horário de funcionamento/ });
  const second = page.getByRole('button', { name: /Crianças também pagam ingresso/ });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await second.click();
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq-answer-1')).toBeVisible();
  await second.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'false');
});

test('date and ticket quantity validation prevents empty, past and Monday visits', async ({
  page,
}) => {
  await home(page);
  await openTickets(page);
  await expect(page.getByRole('button', { name: 'Continuar', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Remover ingresso infantil' })).toBeDisabled();
  await page.getByRole('button', { name: 'Remover ingresso adulto' }).click();
  await expect(page.getByRole('button', { name: 'Remover ingresso adulto' })).toBeDisabled();
  await page.getByLabel('Data da visita', { exact: true }).fill('2026-10-08');
  await expect(page.getByRole('button', { name: 'Continuar', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Adicionar ingresso adulto' }).click();
  await page.getByLabel('Data da visita', { exact: true }).fill('2026-10-06');
  expect(
    await page
      .getByLabel('Data da visita', { exact: true })
      .evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow),
  ).toBe(true);
  await page.getByLabel('Data da visita', { exact: true }).fill('2026-10-12');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('terça a domingo');
  await page.getByRole('button', { name: 'Adicionar ingresso infantil' }).click();
  await expect(page.getByRole('status', { name: 'Quantidade infantil' })).toHaveText('1');
  await advanceVisit(page);
});

test('complete ticket simulation calculates totals, retains previous steps and makes no purchase claim', async ({
  page,
}) => {
  const posts: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') posts.push(request.url());
  });
  await home(page);
  await openTickets(page);
  await page.getByRole('button', { name: 'Adicionar ingresso adulto' }).click();
  await page.getByRole('button', { name: 'Adicionar ingresso infantil' }).click();
  await advanceVisit(page);
  await customerDetails(page);
  await page.getByRole('button', { name: 'Revisar minha visita' }).click();
  await expect(page.locator('.checkout-review__total')).toContainText('224,70');
  await page.getByLabel('Cartão', { exact: true }).check();
  await expect(page.getByLabel('Cartão', { exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Voltar aos dados' }).click();
  await expect(page.getByLabel('Nome completo')).toHaveValue('Pessoa de Teste');
  await page.getByRole('button', { name: 'Revisar minha visita' }).click();
  await page.getByRole('button', { name: 'Concluir simulação', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sua aventura está planejada.' })).toBeVisible();
  await expect(page.locator('.checkout-success')).toContainText(
    'Não houve cobrança nem emissão de ingressos',
  );
  expect(posts).toEqual([]);
  await page.getByRole('button', { name: 'Continuar explorando', exact: true }).click();
  await openTickets(page);
  await expect(page.getByLabel('Data da visita', { exact: true })).toHaveValue('');
  await advanceVisit(page);
  await expect(page.getByLabel('Nome completo')).toHaveValue('');
  await expect(page.getByLabel('E-mail', { exact: true })).toHaveValue('');
});

test('email, name, optional CPF and phone get validated rather than silently accepted', async ({
  page,
}) => {
  await home(page);
  await openTickets(page);
  await advanceVisit(page);
  await page.getByLabel('Nome completo').fill('Teste');
  await page.getByLabel('E-mail', { exact: true }).fill('not-an-email');
  await page.getByRole('button', { name: 'Revisar minha visita' }).click();
  expect(
    await page
      .getByLabel('E-mail', { exact: true })
      .evaluate((input: HTMLInputElement) => input.validity.typeMismatch),
  ).toBe(true);
  await page.getByLabel('E-mail', { exact: true }).fill('visita@example.com');
  await page.getByRole('button', { name: 'Revisar minha visita' }).click();
  await expect(page.getByRole('alert')).toContainText('nome e sobrenome');
  await page.getByLabel('Nome completo').fill('Pessoa de Teste');
  await page.getByLabel('CPF', { exact: false }).fill('11111111111');
  await page.getByRole('button', { name: 'Revisar minha visita' }).click();
  await expect(page.getByRole('alert')).toContainText('CPF');
  await page.getByLabel('CPF', { exact: false }).fill('');
  await page.getByLabel('Celular', { exact: false }).fill('1199');
  await page.getByRole('button', { name: 'Revisar minha visita' }).click();
  await expect(page.getByRole('alert')).toContainText('DDD');
  await page.getByLabel('Celular', { exact: false }).fill('');
  await page.getByRole('button', { name: 'Revisar minha visita' }).click();
  await expect(page.locator('.checkout-review')).toBeVisible();
});

test('menu preserves 21 categories and 124 dishes, with accent-insensitive search and a reset state', async ({
  page,
}) => {
  await page.goto('/cardapio');
  await expect(page.locator('.menu-category')).toHaveCount(21);
  await expect(page.locator('.menu-item')).toHaveCount(124);
  const search = page.getByRole('searchbox', { name: 'Buscar no cardápio' });
  await search.fill('camarao');
  await expect(page.locator('.menu-content')).toContainText('Panelinha de camarão');
  await expect(page.locator('.menu-item').first()).toContainText(/camarão/i);
  await search.fill('zzzzzzzzzz');
  await expect(page.getByRole('heading', { name: 'Nenhum sabor por aqui.' })).toBeVisible();
  await page.getByRole('button', { name: 'Ver todo o cardápio' }).click();
  await expect(search).toBeFocused();
  await expect(page.locator('.menu-item')).toHaveCount(124);
});

test('direct menu anchors and home links land below the fixed navigation', async ({ page }) => {
  await page.goto('/cardapio#cat-pizzas');
  await expect(page.locator('#heading-pizzas')).toBeVisible();
  await expect
    .poll(async () => (await page.locator('#cat-pizzas').boundingBox())?.y)
    .toBeGreaterThan(170);
  await expect
    .poll(async () => (await page.locator('#cat-pizzas').boundingBox())?.y)
    .toBeLessThan(300);
  await page
    .locator('.site-footer')
    .getByRole('link', { name: 'Nossas atrações', exact: true })
    .click();
  await expect(page).toHaveURL('/#atracoes');
  await expect
    .poll(async () => (await page.locator('#atracoes').boundingBox())?.y)
    .toBeGreaterThan(70);
  await expect
    .poll(async () => (await page.locator('#atracoes').boundingBox())?.y)
    .toBeLessThan(240);
});

test('guide provides useful responses without an API key and opens the planner', async ({
  page,
}) => {
  await home(page);
  await page.getByRole('button', { name: 'Abrir guia virtual do Setland' }).click();
  await page.getByRole('button', { name: 'Horários de visita', exact: true }).click();
  await expect(page.getByRole('log')).toContainText('terça a domingo, das 9h às 18h');
  await page.getByRole('textbox', { name: 'Sua pergunta' }).fill('Tem casacos no gelo?');
  await page.getByRole('button', { name: 'Enviar pergunta' }).click();
  await expect(page.getByRole('log')).toContainText('casacos higienizados');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Planejar minha visita', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(page.getByLabel('Data da visita', { exact: true })).toBeVisible();
});

test('mobile menu provides keyboard-safe navigation between existing routes', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Mobile navigation only');
  await home(page);
  const trigger = page.getByRole('button', { name: 'Abrir menu de navegação' });
  await trigger.click();
  await page.keyboard.press('Shift+Tab');
  expect(
    await page.getByRole('dialog').evaluate((dialog) => dialog.contains(document.activeElement)),
  ).toBe(true);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole('navigation', { name: 'Navegação mobile' })
    .getByRole('link', { name: /Gastronomia/ })
    .click();
  await expect(page).toHaveURL('/cardapio');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('sabores');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await trigger.click();
  await page
    .getByRole('navigation', { name: 'Navegação mobile' })
    .getByRole('link', { name: /Atrações/ })
    .click();
  await expect(page).toHaveURL('/#atracoes');
});

test('both pages and every atmosphere have no horizontal overflow at small and large widths', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Viewport sweep is run once');
  for (const path of ['/', '/cardapio']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const theme of ['Atmosfera original', 'Glacial', 'Medieval', 'Futurística']) {
      await page.getByRole('button', { name: 'Alterar atmosfera' }).click();
      await page
        .locator('.theme-switcher__panel')
        .getByRole('button', { name: new RegExp(theme) })
        .click();
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), {
            message: `${path}, ${theme}, at ${width}px`,
          })
          .toBe(true);
      }
    }
  }
});

test('local media resolves and there are no placeholder links or application errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const path of ['/', '/cardapio']) {
    await page.goto(path);
    await page.evaluate(() =>
      document.querySelectorAll('img').forEach((image) => {
        image.loading = 'eager';
      }),
    );
    await expect
      .poll(() =>
        page.evaluate(() =>
          [...document.images].every((image) => image.complete && image.naturalWidth > 0),
        ),
      )
      .toBe(true);
    expect(await page.locator('a[href="#"], a[href=""]').count()).toBe(0);
  }
  expect(errors).toEqual([]);
});

test('home, menu, planner and guide pass automated WCAG AA checks', async ({ page }) => {
  const scan = async () => {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          reason: node.failureSummary,
        })),
      })),
    ).toEqual([]);
  };
  await home(page);
  await scan();
  await openTickets(page);
  await scan();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Abrir guia virtual do Setland' }).click();
  await scan();
  await page.keyboard.press('Escape');
  await page.goto('/cardapio');
  await expect(page.locator('.menu-category')).toHaveCount(21);
  await scan();
});

test('unknown routes offer a working way back to the park', async ({ page }) => {
  await page.goto('/caminho-inexistente');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Uma nova rota');
  await page.getByRole('link', { name: 'Voltar para o parque', exact: true }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Uma viagem');
});
