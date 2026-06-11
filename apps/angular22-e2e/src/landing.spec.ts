import { expect, test } from '@playwright/test';

test.describe('Landing — smoke', () => {
  test('renders the hero and links to both wizard demos', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Demo monorepo angular22/i })).toBeVisible();
    await expect(page.getByTestId('open-individual')).toHaveAttribute('href', 'http://localhost:4201');
    await expect(page.getByTestId('open-business')).toHaveAttribute('href', 'http://localhost:4202');
  });
});
