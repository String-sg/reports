import { expect, test, type Page } from '@playwright/test'

function contentEdges(page: Page, selector: string) {
  return page.locator(selector).evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return [
      bounds.left + parseFloat(style.paddingLeft),
      bounds.right - parseFloat(style.paddingRight),
    ]
  })
}

test('detail reports and changelog align with the overview', async ({ page }) => {
  await page.goto('/')
  const overviewEdges = await contentEdges(page, 'main')
  const overviewBackground = await page.locator('main').evaluate(element => getComputedStyle(element.parentElement!).backgroundColor)

  for (const path of ['/events', '/diagrams', '/changelog']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await contentEdges(page, 'main'), path).toEqual(overviewEdges)
    expect(await contentEdges(page, '.sui-header-inner'), path).toEqual(overviewEdges)
    await expect(page.locator('main').locator('..')).toHaveCSS('background-color', overviewBackground)
    await expect(page.locator('footer')).toHaveCount(1)
  }
})
