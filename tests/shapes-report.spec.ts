import { test, expect } from '@playwright/test';
import { shapesDailyCompletions, shapesGamesCheckedAt, shapesGamesCompleted } from '../lib/data';
import { shapesPublicStartDate } from '../lib/reporting/schema';
import { groupShapesCompletions } from '../lib/shapes-completion-periods';

test('Shapes report displays the same completed games by week and day', async ({ page }) => {
  await page.goto('/');
  const product = page.getByRole('link', { name: 'Primary 2 Shapes Adventure', exact: true });
  await expect(product).toContainText(shapesGamesCompleted!);
  await product.click();

  await expect(page).toHaveURL(/primary-2-shapes-adventure$/);
  await expect(page.getByRole('heading', { name: 'Primary 2 Shapes Adventure', exact: true })).toBeVisible();
  const metrics = page.getByRole('region', { name: 'Shapes usage metrics' });
  await expect(metrics.getByText(shapesGamesCompleted!, { exact: true })).toBeVisible();
  await expect(metrics.getByRole('heading')).toHaveText(['Completed games']);
  const control = metrics.getByRole('combobox', { name: 'Group by' });
  await expect(control.getByRole('option')).toHaveText(['Week', 'Day']);
  await expect(control).toHaveValue('week');

  for (const grouping of ['week', 'day'] as const) {
    await control.selectOption(grouping);
    const chart = metrics.getByLabel(`Completed games chart by ${grouping}`);
    await expect(chart.locator('svg').first()).toBeVisible();
    const table = metrics.getByRole('table', { name: `Completed games by ${grouping}` });
    await expect(table.getByRole('columnheader')).toHaveText([grouping === 'week' ? 'Week' : 'Date', 'Completed games']);
    const periods = groupShapesCompletions(shapesDailyCompletions!.days, shapesPublicStartDate, shapesGamesCheckedAt!, grouping);
    await expect(table.locator('tbody td')).toHaveText(periods.reverse().map(row => row.completedGames.toLocaleString('en-SG')));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
