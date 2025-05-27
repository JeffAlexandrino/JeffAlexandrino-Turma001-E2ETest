import { test, expect, Page } from '@playwright/test';

test('Realizar uma busca e verificar se os resultados estão corretos', async ({ page }: { page: Page }) => {
  // Acessa a página inicial da Wikipedia
  await page.goto('https://www.wikipedia.org/');

  // Define o idioma da busca como português
  await page.locator('select#searchLanguage').selectOption('pt');

  // Termo pesquisado
  const searchTerm = 'Star Wars';
  await page.fill('input[name="search"]', searchTerm);

  await page.click('button[type="submit"]');

  // Aguarda até que o título principal esteja visível
  const headingLocator = page.locator('h1');
  await headingLocator.waitFor();

  // Verifica se o título principal do artigo contém o termo buscado
  const heading = await headingLocator.textContent();
  expect(heading?.toLowerCase()).toContain(searchTerm.toLowerCase());

  // Verifica se a página tem conteúdo suficiente no corpo do artigo
  const content = await page.locator('#mw-content-text').textContent();
  expect(content?.length).toBeGreaterThan(100);
});

test('Selecionar idioma Inglês e verificar redirecionamento', async ({
  page
}: {
  page: Page;
}) => {
  // Acessa a página inicial da Wikipedia
  await page.goto('https://www.wikipedia.org/');

  // Clica no link que leva à Wikipedia em inglês
  await page.click('a[id="js-link-box-en"]');

  // Garante que a URL foi redirecionada corretamente para o domínio em inglês
  await expect(page).toHaveURL(/en\.wikipedia\.org/);

  // Verifica se o título da aba contém a palavra "Wikipedia"
  const title = await page.title();
  expect(title).toContain('Wikipedia');

  // Verifica se o título principal da página também contém "Wikipedia", confirmando o idioma
  const mainHeading = await page.locator('h1').first().textContent();
  expect(mainHeading?.trim()).toBe('Main Page');
});
