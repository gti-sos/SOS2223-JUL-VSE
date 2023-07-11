//@ts-check
import { test, expect } from'@playwright/test';

test('get products link', async ({ page }) => {
    await page.goto('https://sos2223-24.appspot.com/agroprices-weekly');
  
    // Click the get started link.
    await page.getByRole('link', { name: 'Productos' }).click();
    await page.getByRole('link', { name: 'Página de Inicio' }).click();

  
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*agroprices-weekly/);
  });