import { expect, type Page, test } from '@playwright/test';

/**
 * Portal RBAC (mock auth via `@angular22/shared-auth`). Covers per-role element
 * visibility, the demo role switcher (interactive elements), and — crucially —
 * negative authorization: a non-admin deep-linking to a guarded route is
 * redirected to `/forbidden`, not merely shown a hidden button.
 */

/** Seed the mock auth role before the app boots (re-applied on every navigation). */
async function asRole(page: Page, role: 'admin' | 'user' | 'guest'): Promise<void> {
  await page.addInitScript((r) => window.localStorage.setItem('a22.mock-role', r), role);
}

test.describe('Portal — RBAC (mock auth)', () => {
  test('user role: admin link hidden, identity shown', async ({ page }) => {
    await asRole(page, 'user');
    await page.goto('/');
    await expect(page.getByTestId('auth-bar')).toBeVisible();
    await expect(page.getByTestId('auth-user')).toHaveText('user-demo');
    await expect(page.getByTestId('auth-role')).toHaveText('user');
    await expect(page.getByTestId('admin-link')).toHaveCount(0);
  });

  test('guest role: admin link hidden', async ({ page }) => {
    await asRole(page, 'guest');
    await page.goto('/');
    await expect(page.getByTestId('auth-role')).toHaveText('guest');
    await expect(page.getByTestId('admin-link')).toHaveCount(0);
  });

  test('admin role: admin link visible and opens the admin panel', async ({ page }) => {
    await asRole(page, 'admin');
    await page.goto('/');
    await expect(page.getByTestId('auth-role')).toHaveText('admin');
    const link = page.getByTestId('admin-link');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByTestId('admin-panel')).toBeVisible();
  });

  test('role switcher flips element visibility (interactive sweep)', async ({ page }) => {
    // No seed → initial mock role is 'user'.
    await page.goto('/');
    await expect(page.getByTestId('auth-role')).toHaveText('user');
    await expect(page.getByTestId('admin-link')).toHaveCount(0);

    // Switch up to admin via the demo buttons → app persists the role and reloads.
    await page.getByTestId('role-switch-admin').click();
    await expect(page.getByTestId('auth-role')).toHaveText('admin');
    await expect(page.getByTestId('admin-link')).toBeVisible();

    // …and back down to guest.
    await page.getByTestId('role-switch-guest').click();
    await expect(page.getByTestId('auth-role')).toHaveText('guest');
    await expect(page.getByTestId('admin-link')).toHaveCount(0);
  });

  test('negative authz: a non-admin deep-linking to /admin is redirected to /forbidden', async ({ page }) => {
    await asRole(page, 'user');
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/forbidden$/);
    await expect(page.getByTestId('error-forbidden')).toBeVisible();
  });

  test('admin can deep-link straight to /admin', async ({ page }) => {
    await asRole(page, 'admin');
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByTestId('admin-panel')).toBeVisible();
  });
});
