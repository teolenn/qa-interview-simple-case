import { test, expect } from '@playwright/test'
import { existingUsers } from '../../test-setup/localstorage.setup'

test.describe.configure({ mode: 'serial' })

test.describe('login form tests', () => {
  test('logging in works with existing account', async ({ page }) => {
    await page.goto('localhost:8080/login')

    // Make sure we are at the expected page with the correct heading
    await expect(
      page.getByRole('heading', { name: 'Strawberry QA', exact: true }),
    ).toBeVisible()

    const existingUser = existingUsers[0]

    // Using pages build in getByLabel instead of navigating by classes that easily can be changed for other reasons than what will interrupt main functionality.
    await page.getByLabel('Email').fill(existingUser.email)
    await page
      .getByLabel('Password', { exact: true })
      .fill(existingUser.password)

    // Make sure the element has a role button, to avoid conflicting with other potential elements with the text 'Login'
    const loginButton = page.getByRole('button').and(page.getByText('Login'))
    loginButton.click()

    // Removing timeout to remove flakiness - instead using built-in waiting mechanism in Playwright that runs before click.
    // This is a time saver: Timeout leads to the elements ability to load before our hard wait has expired i.e. wasted time

    const logoutButton = page.getByRole('button').and(page.getByText('Log out'))
    await expect(logoutButton).toBeVisible()
  })
})
