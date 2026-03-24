import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('homepage loads without errors', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText('Blog')
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('videos page loads without errors', async ({ page }) => {
    const response = await page.goto('/videos')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText('Videos')
  })

  test('about page loads without errors', async ({ page }) => {
    const response = await page.goto('/about')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('non-existent blog post returns 404', async ({ page }) => {
    const response = await page.goto('/blog/this-slug-does-not-exist-999')
    expect(response?.status()).toBe(404)
  })

  test('non-existent video returns 404', async ({ page }) => {
    const response = await page.goto('/videos/this-slug-does-not-exist-999')
    expect(response?.status()).toBe(404)
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')

    await page.click('nav a[href="/videos"]')
    await expect(page).toHaveURL('/videos')
    await expect(page.locator('h1')).toContainText('Videos')

    await page.click('nav a[href="/about"]')
    await expect(page).toHaveURL('/about')

    await page.click('nav a[href="/"]')
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('Blog')
  })
})
