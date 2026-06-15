import { expect, test } from '@playwright/test';

/**
 * Base app smoke — the starter app renders only its header. Apps copied from
 * this template extend (or replace) these checks as they add pages.
 */
test.describe('Base — smoke', () => {
  test('renders the header with brand and language switcher', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a22-toolbar')).toBeVisible();
    await expect(page.getByTestId('base-brand')).toBeVisible();
    await expect(page.getByTestId('lang-pl')).toBeVisible();
    await expect(page.getByTestId('lang-en')).toBeVisible();
  });

  test('the language switcher toggles the brand PL <-> EN', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('base-brand')).toHaveText('Aplikacja bazowa');

    await page.getByTestId('lang-en').click();
    await expect(page.getByTestId('base-brand')).toHaveText('Base application');

    await page.getByTestId('lang-pl').click();
    await expect(page.getByTestId('base-brand')).toHaveText('Aplikacja bazowa');
  });
});
