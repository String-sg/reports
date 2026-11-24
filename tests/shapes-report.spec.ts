import { test, expect } from '@playwright/test';
import { shapesGamesCompleted } from '../lib/data';
test('product card opens its report and renders aggregate usage', async ({ page }) => {
  await page.route('**/api/shapes-metrics', route => route.fulfill({ json: {
    version: 1, periodDays: 30, generatedAt: '2026-10-26T12:00:00.000Z', visits: 42, gamesStarted: 30, gamesCompleted: 20,
    reportingTimezone: 'Asia/Singapore', firstEventAt: '2026-08-01T00:00:00.000Z',
    allTime: { visits: 100, gamesStarted: 60, gamesCompleted: 40 },
    monthly: [{ month: '2026-08', visits: 58, gamesStarted: 30, gamesCompleted: 20 },
      { month: '2026-09', visits: 0, gamesStarted: 0, gamesCompleted: 0 },
      { month: '2026-10', visits: 42, gamesStarted: 30, gamesCompleted: 20 }],
  } }));
  await page.goto('/');
  const product = page.getByRole('link', { name: 'Primary 2 Shapes Adventure', exact: true });
  await expect(product).toContainText(shapesGamesCompleted!);
  await product.click();
  await expect(page).toHaveURL(/primary-2-shapes-adventure$/);
  await expect(page.getByRole('heading', { name: 'Primary 2 Shapes Adventure', exact: true })).toBeVisible();
  const metrics = page.getByRole('region', { name: 'Shapes usage metrics' });
  await expect(metrics.getByText(shapesGamesCompleted!, { exact: true })).toBeVisible();
  await expect(metrics.getByRole('heading', { name: 'Opt-in activity' })).toBeVisible();
  await expect(metrics).toContainText('42');
  await expect(metrics).toContainText('30');
  await expect(metrics).toContainText('20');
  await expect(metrics).toContainText('not unique pupils');
  await expect(metrics).toContainText('SGT');
  await expect(page.getByLabel('All-time totals')).toContainText('100');
  await expect(page.getByLabel('All-time totals')).toContainText('1 Aug 2026');
  const table = page.getByRole('table', { name: 'Monthly activity counts' });
  await expect(table.getByRole('columnheader', { name: 'Reconciled completed games' })).toBeVisible();
  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(4);
  await expect(rows.first().getByRole('rowheader')).toHaveText('Nov 2026 (partial)');
  await expect(rows.first().getByRole('cell')).toHaveText(['—', '—', '—', '225']);
  await expect(rows.nth(1).getByRole('rowheader')).toHaveText('Oct 2026 (partial)');
  await expect(rows.nth(2).getByRole('rowheader')).toHaveText('Sept 2026');
  await expect(rows.nth(2).getByRole('cell')).toHaveText(['0', '0', '0', '—']);
  const chart = page.getByLabel('Monthly usage chart, latest 12 months');
  await expect(chart.locator('svg').first()).toBeVisible();
  await expect(chart.getByText('Reconciled completed games', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('zero activity is shown as zero; a failed feed is shown as unavailable', async ({ page }) => {
  await page.route('**/api/shapes-metrics', route => route.fulfill({ json: {
    version: 1, periodDays: 30, generatedAt: '2026-10-26T12:00:00.000Z', visits: 0, gamesStarted: 0, gamesCompleted: 0,
    reportingTimezone: 'Asia/Singapore', firstEventAt: null, allTime: { visits: 0, gamesStarted: 0, gamesCompleted: 0 }, monthly: [],
  } }));
  await page.goto('/primary-2-shapes-adventure');
  await expect(page.getByLabel('All-time totals').getByText('0', { exact: true })).toHaveCount(3);
  await page.unroute('**/api/shapes-metrics');
  await page.route('**/api/shapes-metrics', route => route.fulfill({ status: 503, json: { error: 'metrics_unavailable' } }));
  await page.reload();
  await expect(page.getByRole('status')).toContainText('temporarily unavailable');
  await expect(page.getByText(shapesGamesCompleted!, { exact: true })).toBeVisible();
  await expect(page.getByLabel('All-time totals')).toHaveCount(0);
  const table = page.getByRole('table', { name: 'Monthly activity counts' });
  await expect(table.locator('tbody tr').first().getByRole('cell')).toHaveText(['—', '—', '—', '225']);
});
