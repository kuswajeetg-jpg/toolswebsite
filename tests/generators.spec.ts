import { test, expect } from '@playwright/test';

test.describe('Document Generators', () => {

  test('Invoice Generator creates preview', async ({ page }) => {
    await page.goto('/tools/invoice-generator');
    
    // Fill required fields
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('My Business Corp');
    await textareas.nth(1).fill('Client John Doe');
    
    // Add an item
    await page.locator('input[placeholder="Item description"]').first().fill('Web Design');
    await page.locator('input[placeholder="Qty"]').first().fill('10');
    await page.locator('input[placeholder="Rate"]').first().fill('50');
    
    // Check if total updates (10 * 50 = 500, + 10% tax = 550)
    await expect(page.getByText('$550.00')).toBeVisible();
    
    // Check if Canvas is rendered and image preview exists
    await expect(page.locator('img[alt="Invoice Preview"]')).toBeVisible();
  });

});
