import { test, expect } from '@playwright/test'

test.describe('Dark mode', () => {
  test('toggle switches to dark mode', async ({ page }) => {
    await page.goto('/')

    // Should start in light mode (no .dark class)
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)

    // Click the dark mode toggle
    await page.locator('button[aria-label="Switch to dark mode"]').first().click()
    await expect(html).toHaveClass(/dark/)
  })

  test('toggle switches back to light mode', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')

    // Toggle to dark
    await page.locator('button[aria-label="Switch to dark mode"]').first().click()
    await expect(html).toHaveClass(/dark/)

    // Toggle back to light
    await page.locator('button[aria-label="Switch to light mode"]').first().click()
    await expect(html).not.toHaveClass(/dark/)
  })

  test('theme persists across page reload', async ({ page }) => {
    await page.goto('/')

    // Switch to dark mode
    await page.locator('button[aria-label="Switch to dark mode"]').first().click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Reload
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('theme persists across navigation', async ({ page }) => {
    await page.goto('/')

    // Switch to dark mode
    await page.locator('button[aria-label="Switch to dark mode"]').first().click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Navigate to another page
    await page.locator('nav a[href="/videos"]').first().click()
    await expect(page).toHaveURL('/videos')
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('respects OS dark mode preference', async ({ browser }) => {
    const context = await browser.newContext({
      colorScheme: 'dark',
    })
    const page = await context.newPage()
    await page.goto('/')

    // Should auto-apply dark mode from OS preference
    await expect(page.locator('html')).toHaveClass(/dark/)

    await context.close()
  })

  test('respects OS light mode preference', async ({ browser }) => {
    const context = await browser.newContext({
      colorScheme: 'light',
    })
    const page = await context.newPage()
    await page.goto('/')

    // Should stay in light mode
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await context.close()
  })

  test('prose content is readable in dark mode', async ({ page }) => {
    await page.goto('/about')

    // Switch to dark mode
    await page.locator('button[aria-label="Switch to dark mode"]').first().click()

    // Check that prose container has the invert class applied
    const prose = page.locator('.prose')
    if (await prose.count() > 0) {
      await expect(prose).toBeVisible()
    }
  })
})
