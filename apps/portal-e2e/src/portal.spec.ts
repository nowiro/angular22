import { expect, test } from '@playwright/test';

/**
 * Portal smoke — tiles, in-portal web-component embedding (header hidden),
 * feature flags from config.json, language sync into the embedded runtime.
 */
test.describe('Portal — smoke', () => {
  test('home renders a tile per enabled app with both open actions', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('portal-tiles')).toBeVisible();

    for (const id of ['individual-wizard', 'business-wizard']) {
      await expect(page.getByTestId(`tile-${id}`)).toBeVisible();
      const tab = page.getByTestId(`open-tab-${id}`);
      await expect(tab).toHaveAttribute('target', '_blank');
      await expect(tab).toHaveAttribute('href', /localhost:42/);
      await expect(page.getByTestId(`open-embed-${id}`)).toBeVisible();
    }
  });

  test('embeds the individual wizard as a web component WITHOUT its header', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('open-embed-individual-wizard').click();
    await expect(page).toHaveURL(/\/apps\/individual$/);

    const element = page.locator('a22-individual-wizard-element');
    await expect(element).toBeVisible({ timeout: 20_000 });
    // wizard renders inside the element…
    await expect(element.getByTestId('wizard-stepper')).toBeVisible();
    await expect(element.getByTestId('basic-first-name')).toBeVisible();
    // …but its own chrome is hidden (embedded mode): no wizard toolbar/intro.
    await expect(element.locator('a22-toolbar')).toHaveCount(0);
    // the PORTAL header stays.
    await expect(page.getByTestId('portal-home')).toBeVisible();
  });

  test('embedded wizard follows the portal language switcher', async ({ page }) => {
    await page.goto('/apps/individual');
    const element = page.locator('a22-individual-wizard-element');
    await expect(element.getByTestId('wizard-stepper')).toBeVisible({ timeout: 20_000 });
    await expect(element.getByText('Dane podstawowe').first()).toBeVisible();

    await page.getByTestId('lang-en').click();
    await expect(element.getByText('Basic data').first()).toBeVisible();

    await page.getByTestId('lang-pl').click();
    await expect(element.getByText('Dane podstawowe').first()).toBeVisible();
  });

  test('a flag disabled in config.json hides the tile and blocks the route', async ({ page }) => {
    await page.route('**/config.json', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          features: {
            'business-wizard': { enabled: false },
          },
        }),
      }),
    );

    await page.goto('/');
    await expect(page.getByTestId('tile-individual-wizard')).toBeVisible();
    await expect(page.getByTestId('tile-business-wizard')).toHaveCount(0);

    // Deep link to the disabled app bounces back to the tile list.
    await page.goto('/apps/business');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('portal-tiles')).toBeVisible();
  });

  test('all flags off shows the empty state', async ({ page }) => {
    await page.route('**/config.json', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          features: {
            'individual-wizard': { enabled: false },
            'business-wizard': { enabled: false },
          },
        }),
      }),
    );

    await page.goto('/');
    await expect(page.getByTestId('portal-empty')).toBeVisible();
  });
});
