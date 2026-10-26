import { test, expect } from '@playwright/test';
test('product card opens its report and renders aggregate usage', async ({ page }) => {
  await page.route('**/api/shapes-metrics', route => route.fulfill({ json: {
    version: 1, periodDays: 30, generatedAt: '2026-10-26T12:00:00.000Z', visits: 42, gamesStarted: 30, gamesCompleted: 20,
  } }));
  await page.goto('/');
  await page.getByRole('link', { name: 'Primary 2 Shapes Adventure', exact: true }).click();
  await expect(page).toHaveURL(/primary-2-shapes-adventure$/);
  await expect(page.getByRole('heading', { name: 'Primary 2 Shapes Adventure', exact: true })).toBeVisible();
  const metrics = page.getByRole('region', { name: 'Shapes usage metrics' });
  await expect(metrics).toContainText('42');
  await expect(metrics).toContainText('30');
  await expect(metrics).toContainText('20');
  await expect(metrics).toContainText('not unique pupils');
  await expect(metrics).toContainText('SGT');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('zero activity is shown as zero; a failed feed is shown as unavailable', async ({ page }) => {
  await page.route('**/api/shapes-metrics', route => route.fulfill({ json: {
    version: 1, periodDays: 30, generatedAt: '2026-10-26T12:00:00.000Z', visits: 0, gamesStarted: 0, gamesCompleted: 0,
  } }));
  await page.goto('/primary-2-shapes-adventure');
  await expect(page.locator('#metrics').getByText('0', { exact: true })).toHaveCount(3);
  await page.unroute('**/api/shapes-metrics');
  await page.route('**/api/shapes-metrics', route => route.fulfill({ status: 503, json: { error: 'metrics_unavailable' } }));
  await page.reload();
  await expect(page.getByRole('status')).toContainText('temporarily unavailable');
  await expect(page.locator('#metrics').getByText('0', { exact: true })).toHaveCount(0);
});
