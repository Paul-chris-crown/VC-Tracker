import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display sign in page', async ({ page }) => {
    await page.goto('/signin')
    
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByText('Sign in to your account to continue')).toBeVisible()
  })

  test('should display sign up page', async ({ page }) => {
    await page.goto('/signup')
    
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
    await expect(page.getByText('Get started with VC Tracker')).toBeVisible()
  })

  test('should navigate between sign in and sign up', async ({ page }) => {
    await page.goto('/signin')
    
    // Click sign up link
    await page.getByRole('link', { name: 'Sign up' }).click()
    await expect(page).toHaveURL('/signup')
    
    // Click sign in link
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/signin')
  })
})
