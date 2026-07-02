import { test, expect } from '@playwright/test';

test.describe('Calculators', () => {

  test('Scientific Calculator basic operations', async ({ page }) => {
    await page.goto('/tools/scientific-calculator');
    
    // Check if it loads
    await expect(page.locator('h1')).toContainText('Scientific Calculator');
    
    // Type a simple calculation: 5 * 5
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '×', exact: true }).click();
    await page.getByRole('button', { name: '5', exact: true }).click();
    
    // Calculate
    await page.getByRole('button', { name: '=', exact: true }).click();
    
    // Verify result is 25
    await expect(page.locator('.text-right.text-white').first()).toHaveText('25');
  });

  test('Currency Converter handles mock conversion', async ({ page }) => {
    await page.goto('/tools/currency-converter');
    
    // Input amount 100
    const input = page.locator('input[type="number"]').first();
    await input.fill('100');
    
    // Select USD to INR
    const selects = page.locator('select');
    await selects.nth(0).selectOption('USD');
    await selects.nth(1).selectOption('INR');
    
    // Check output contains 8350 (since rate is 83.5)
    await expect(page.locator('.text-indigo-600').nth(1)).toContainText('8,350.00');
  });

  test('EMI Calculator calculates correctly', async ({ page }) => {
    await page.goto('/tools/emi-calculator');
    
    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill('100000'); // Loan amount
    await inputs.nth(1).fill('10');     // Interest rate
    await inputs.nth(2).fill('1');      // Tenure in years
    
    await page.getByRole('button', { name: /Calculate EMI/i }).click();
    
    // EMI for 100k at 10% for 1 year (12 months) is ~8792
    await expect(page.locator('.text-2xl.font-bold.text-blue-600').first()).toContainText('8,792');
  });

});
