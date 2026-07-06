import { test, expect } from '@playwright/test';

test.describe('Robots.txt & Meta Tags Generator Tool', () => {

  test('Page loads and generates default robots.txt', async ({ page }) => {
    await page.goto('/tools/robots-txt-generator');
    
    // Check title element
    await expect(page.locator('h1')).toContainText('Robots.txt & Robots Meta Tag Builder');
    
    // Check default generated robots.txt output contains Allow: /
    const outputBox = page.locator('pre');
    await expect(outputBox).toContainText('User-agent: *');
    await expect(outputBox).toContainText('Allow: /');
  });

  test('Switching tabs changes content panels', async ({ page }) => {
    await page.goto('/tools/robots-txt-generator');
    
    // Click Robots Meta Tag Builder tab
    await page.getByRole('button', { name: 'Robots Meta Tag Builder' }).click();
    
    // Verify meta options are visible
    await expect(page.locator('text=noindex')).toBeVisible();
    await expect(page.locator('text=nosnippet')).toBeVisible();
    
    // Click Robots.txt Tester tab
    await page.getByRole('button', { name: 'Robots.txt Tester' }).click();
    
    // Verify analyzer/tester is visible
    await expect(page.locator('text=Analyze Rules & Test URL Paths')).toBeVisible();
  });

  test('Robots.txt Analyzer correctly tests allow/disallow paths', async ({ page }) => {
    await page.goto('/tools/robots-txt-generator');
    
    // Switch to analyzer tab
    await page.getByRole('button', { name: 'Robots.txt Tester' }).click();
    
    // Fill path to test
    const pathInput = page.locator('input[placeholder="e.g. /admin/settings"]');
    await pathInput.fill('/admin/dashboard');
    
    // Run test
    await page.getByRole('button', { name: 'Run Crawl Eligibility Test' }).click();
    
    // Since default custom rules has Googlebot disallow /admin/, it should block it
    await expect(page.locator('text=BLOCKED / DISALLOWED')).toBeVisible();
  });

});
