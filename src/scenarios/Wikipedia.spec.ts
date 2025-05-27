import { test, expect, Page } from '@playwright/test';

test('Realizar uma busca e verificar se os resultados estão corretos', async ({
  page
}: {
  page: Page;
}) => {
  // Acessa a página inicial da Wikipedia
  await page.goto('https://www.wikipedia.org/');

  // Define o idioma da busca como português
  await page.locator('select#searchLanguage').selectOption('pt');

  // Termo pesquisado
  const searchTerm = 'Star Wars';
  await page.fill('input[name="search"]', searchTerm);

  await page.click('button[type="submit"]');

  // Verifica se o título da aba contém o termo buscado
  const pageTitle = await page.title();
  expect(pageTitle).toContain(searchTerm);

  // Verifica se o título principal do artigo corresponde ao termo buscado
  const heading = await page.locator('h1').textContent();
  expect(heading).toContain(searchTerm);

  // Verifica se a página tem conteúdo suficiente no corpo do artigo
  const content = await page.locator('#mw-content-text').textContent();
  expect(content?.length).toBeGreaterThan(100);
});

test('Selecionar idioma Inglês e verificar redirecionamento', async ({
  page
}: {
  page: Page;
}) => {
  await test.step('Acessar a página inicial da Wikipedia', async () => {
    await page.goto('https://www.wikipedia.org/');
  });

  await test.step('Clicar no link da Wikipedia em inglês', async () => {
    await page.click('a[id="js-link-box-en"]');
  });

  await test.step('Verificar se a URL foi redirecionada corretamente', async () => {
    await expect(page).toHaveURL(/en\.wikipedia\.org/);
  });

  await test.step('Verificar se o título da aba contém "Wikipedia"', async () => {
    const title = await page.title();
    expect(title).toContain('Wikipedia');
  });

  await test.step('Verificar se o título principal da página é "Main Page"', async () => {
    const mainHeading = await page.locator('h1').first().textContent();
    expect(mainHeading).toContain('Main Page');
  });
});
