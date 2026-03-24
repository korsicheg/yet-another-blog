import { test, expect } from '@playwright/test'

test.describe('Mobile navigation @mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('hamburger menu is visible on mobile', async ({ page }) => {
    await page.goto('/')

    // Hamburger button should be visible
    const hamburger = page.locator('button[aria-label="Open menu"]')
    await expect(hamburger).toBeVisible()
  })

  test('hamburger opens and closes menu', async ({ page }) => {
    await page.goto('/')

    // Open menu
    await page.click('button[aria-label="Open menu"]')

    // Mobile dropdown should be visible with nav links
    const dropdown = page.locator('nav >> div.absolute')
    await expect(dropdown).toBeVisible()
    await expect(dropdown.locator('a')).toHaveCount(3)

    // Close menu
    await page.click('button[aria-label="Close menu"]')
    await expect(dropdown).not.toBeVisible()
  })

  test('menu closes on navigation', async ({ page }) => {
    await page.goto('/')

    // Open menu and click a link
    await page.click('button[aria-label="Open menu"]')
    const dropdown = page.locator('nav >> div.absolute')
    await expect(dropdown).toBeVisible()

    // Click Videos link in the dropdown
    await dropdown.locator('a[href="/videos"]').click()
    await expect(page).toHaveURL('/videos')

    // Menu should be closed after navigation
    await expect(dropdown).not.toBeVisible()
  })

  test('theme toggle is accessible on mobile', async ({ page }) => {
    await page.goto('/')

    // Desktop toggle is hidden on mobile; the mobile toggle is the second (last) in DOM
    const themeButton = page.locator('button[aria-label="Switch to dark mode"]').last()
    await expect(themeButton).toBeVisible()
  })

  test('touch targets meet minimum size', async ({ page }) => {
    await page.goto('/')

    // Check hamburger button size
    const hamburger = page.locator('button[aria-label="Open menu"]')
    const hamburgerBox = await hamburger.boundingBox()
    expect(hamburgerBox!.height).toBeGreaterThanOrEqual(36)
    expect(hamburgerBox!.width).toBeGreaterThanOrEqual(36)
  })
})

test.describe('Desktop navigation @desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test('desktop nav links are visible, hamburger is hidden', async ({ page }) => {
    await page.goto('/')

    // Nav links should be visible
    await expect(page.locator('nav a[href="/videos"]')).toBeVisible()
    await expect(page.locator('nav a[href="/about"]')).toBeVisible()

    // Hamburger should not be visible
    const hamburger = page.locator('button[aria-label="Open menu"]')
    await expect(hamburger).not.toBeVisible()
  })
})
