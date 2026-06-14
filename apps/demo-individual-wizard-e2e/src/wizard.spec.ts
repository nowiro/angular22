import { expect, test } from '@playwright/test';

/**
 * Smoke E2E for the individual wizard (Signal Forms).
 *
 * Flow under test:
 *   1. `/`        → dashboard renders 5 step tiles
 *   2. tiles      → deep-link to `/wizard/:step`
 *   3. dev panel  → "Maksymalne zagnieżdżenia" fills the whole model
 *   4. summary    → submit unlocks and stamps `submittedAt`
 */
test.describe('Individual wizard — smoke', () => {
  test('dashboard renders 5 tiles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('wizard-dashboard')).toBeVisible();
    for (let step = 1; step <= 5; step++) {
      await expect(page.getByTestId(`dashboard-tile-${step}`)).toBeVisible();
    }
  });

  test('deep-link to step 3 opens the survey directly', async ({ page }) => {
    await page.goto('/wizard/3');
    await expect(page.getByTestId('wizard-stepper')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Ankieta/i })).toBeVisible();
  });

  test('required-field error surfaces on touch', async ({ page }) => {
    await page.goto('/wizard/1');
    await page.getByTestId('basic-first-name').click();
    await page.getByTestId('basic-last-name').click();
    await expect(
      page
        .getByTestId('field-error')
        .filter({ hasText: /wymagane/i })
        .first(),
    ).toBeVisible();
  });

  test('valid PESEL autofills and locks the birth date', async ({ page }) => {
    await page.goto('/wizard/1');
    await page.getByTestId('basic-pesel').fill('44051401359');
    await expect(page.getByTestId('basic-pesel-lock')).toBeVisible();
    await expect(page.getByTestId('basic-dob')).toBeDisabled();
  });

  test('happy path: dev-fill (max) → all statuses done → submit succeeds', async ({ page }) => {
    await page.goto('/');

    // Fill everything through the dev panel, then collapse it so it doesn't
    // overlap the tiles.
    await page.getByTestId('dev-fab-toggle').click();
    await page.getByTestId('dev-fill-full-demo').click();
    await page.getByTestId('dev-fab-toggle').click();

    for (let step = 1; step <= 5; step++) {
      await expect(page.getByTestId(`dashboard-status-${step}`)).toHaveText('Ukończone');
    }

    await page.getByTestId('dashboard-tile-5').click();
    await expect(page).toHaveURL(/\/wizard\/5$/);

    const submit = page.getByTestId('summary-submit');
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByTestId('summary-submitted')).toBeVisible();
  });

  test('standalone mode shows the wizard header (toolbar)', async ({ page }) => {
    await page.goto('/wizard/1');
    await expect(page.getByTestId('topbar-home')).toBeVisible();
  });

  test('disabled feature flag blocks the whole app with a notice', async ({ page }) => {
    await page.route('**/config.json', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ features: { 'individual-wizard': { enabled: false } } }),
      }),
    );

    await page.goto('/');
    await expect(page.getByTestId('app-disabled')).toBeVisible();
    await page.goto('/wizard/1');
    await expect(page.getByTestId('app-disabled')).toBeVisible();
  });

  test('language switcher flips PL → EN and persists across reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Pulpit kreatora' })).toBeVisible();

    await page.getByTestId('lang-en').click();
    await expect(page.getByRole('heading', { name: 'Wizard dashboard' })).toBeVisible();
    await expect(page.getByTestId('dashboard-status-1')).toHaveText('Not started');

    // Choice is persisted in localStorage — survives a hard reload.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Wizard dashboard' })).toBeVisible();

    await page.getByTestId('lang-pl').click();
    await expect(page.getByRole('heading', { name: 'Pulpit kreatora' })).toBeVisible();
  });

  test('conditional survey branches appear with education level', async ({ page }) => {
    await page.goto('/wizard/3');
    await expect(page.getByTestId('survey-higher-education')).toBeHidden();

    // secondary → phd reveals the higher-education branch.
    await page.getByTestId('survey-education-level').click();
    await page.getByTestId('survey-education-level-opt-phd').click();
    await expect(page.getByTestId('survey-higher-education')).toBeVisible();

    // IT field reveals the specialisation; data/security branch reveals the thesis.
    await page.getByTestId('survey-study-field').click();
    await page.getByTestId('survey-study-field-opt-IT').click();
    await expect(page.getByTestId('survey-specialisation')).toBeVisible();

    await page.getByTestId('survey-branch').click();
    await page.getByTestId('survey-branch-opt-security').click();
    await expect(page.getByTestId('survey-thesis')).toBeVisible();
  });
});
