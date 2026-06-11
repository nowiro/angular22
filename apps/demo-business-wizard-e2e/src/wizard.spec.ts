import { expect, test } from '@playwright/test';

/**
 * Smoke E2E for the business wizard (Signal Forms).
 */
test.describe('Business wizard — smoke', () => {
  test('dashboard renders 6 tiles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('wizard-dashboard')).toBeVisible();
    for (let step = 1; step <= 6; step++) {
      await expect(page.getByTestId(`dashboard-tile-${step}`)).toBeVisible();
    }
  });

  test('deep-link to step 3 opens the profile directly', async ({ page }) => {
    await page.goto('/wizard/3');
    await expect(page.getByTestId('wizard-stepper')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Profil działalności/i })).toBeVisible();
  });

  test('NIP checksum error surfaces for an invalid value', async ({ page }) => {
    await page.goto('/wizard/1');
    await page.getByTestId('basics-nip').fill('1234567890');
    await page.getByTestId('basics-regon').click();
    await expect(page.getByTestId('field-error').filter({ hasText: /NIP/i }).first()).toBeVisible();
  });

  test('finance industry adds the PSD2 consent', async ({ page }) => {
    await page.goto('/wizard/3');
    await page.getByTestId('profile-industry').click();
    await page.getByRole('option', { name: 'Finanse i ubezpieczenia' }).click();
    // Navigate within the SPA (a hard `goto` would reset the in-memory store).
    await page.getByTestId('step-3-next').click();
    await page.getByTestId('step-4-next').click();
    await expect(page).toHaveURL(/\/wizard\/5$/);
    await expect(page.getByTestId('consent-psd2-disclosure')).toBeVisible();
  });

  test('language switcher flips PL → EN and back', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Pulpit kreatora firmy' })).toBeVisible();

    await page.getByTestId('lang-en').click();
    await expect(page.getByRole('heading', { name: 'Company wizard dashboard' })).toBeVisible();

    await page.getByTestId('lang-pl').click();
    await expect(page.getByRole('heading', { name: 'Pulpit kreatora firmy' })).toBeVisible();
  });

  test('happy path: dev-fill (max) → all statuses done → submit succeeds', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('dev-fab-toggle').click();
    await page.getByTestId('dev-fill-full-demo').click();
    await page.getByTestId('dev-fab-toggle').click();

    for (let step = 1; step <= 6; step++) {
      await expect(page.getByTestId(`dashboard-status-${step}`)).toHaveText('Ukończone');
    }

    await page.getByTestId('dashboard-tile-6').click();
    await expect(page).toHaveURL(/\/wizard\/6$/);

    const submit = page.getByTestId('summary-submit');
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByTestId('summary-submitted')).toBeVisible();
  });
});
