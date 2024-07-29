import { test, expect } from '@playwright/test'
import { createUser } from './helper'

test.describe.configure({ mode: 'serial' })

test.describe('signup form tests', () => {
  test('signup works with new account', async ({ page }) => {
    await page.goto('http://localhost:8080/signup')

    // Make sure we are at the expected page with the correct content
    await expect(page.getByText('Become a member')).toBeVisible()
    const newUser = createUser()

    // Fill in form with details
    await page.getByLabel('First name').fill(newUser.firstName)
    await page.getByLabel('Last name').fill(newUser.lastName)
    await page.getByLabel('Email').fill(newUser.email)
    await page.getByLabel('Password', { exact: true }).fill(newUser.password)

    // Click the submit button
    const submitButton = page.getByRole('button').and(page.getByText('Submit'))
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    // Confirm creation success by verify that we are logged in
    await expect(
      page.getByRole('heading', { name: 'Company', exact: true }),
    ).toBeVisible()

    // Log out
    await page.getByRole('button').and(page.getByText('Log out')).click()

    // Verify that we are back on login page
    await expect(
      page.getByRole('button').and(page.getByText('Login')),
    ).toBeVisible()

    // Verify that login works with newly created account
    await page.goto('http://localhost:8080/login')

    await page.getByLabel('Email').fill(newUser.email)
    await page.getByLabel('Password', { exact: true }).fill(newUser.password)

    const loginButton = page.getByRole('button').and(page.getByText('Login'))
    loginButton.click()

    const logoutButton = page.getByRole('button').and(page.getByText('Log out'))
    await expect(logoutButton).toBeVisible()
  })
})
