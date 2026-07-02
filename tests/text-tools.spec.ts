import { test, expect } from '@playwright/test';

test.describe('Text & Developer Tools', () => {

  test('JSON Formatter validates correctly', async ({ page }) => {
    await page.goto('/tools/json-formatter');
    
    const textarea = page.locator('textarea').first();
    await textarea.fill('{"name": "test"}');
    
    await page.getByRole('button', { name: 'Format & Validate' }).click();
    
    // Output should contain formatted JSON
    const output = page.locator('textarea').nth(1);
    await expect(output).toHaveValue(/\{\n  "name": "test"\n\}/);
    
    // Test invalid JSON
    await textarea.fill('{"name": "test"');
    await page.getByRole('button', { name: 'Format & Validate' }).click();
    
    await expect(page.locator('.text-red-500')).toContainText('Invalid JSON');
  });

  test('Case Converter works', async ({ page }) => {
    await page.goto('/tools/case-converter');
    
    const textarea = page.locator('textarea').first();
    await textarea.fill('hello world');
    
    await page.getByRole('button', { name: 'UPPERCASE' }).click();
    await expect(textarea).toHaveValue('HELLO WORLD');
    
    await page.getByRole('button', { name: 'Title Case' }).click();
    await expect(textarea).toHaveValue('Hello World');
  });

  test('Word Counter updates live', async ({ page }) => {
    await page.goto('/tools/word-counter');
    
    const textarea = page.locator('textarea').first();
    await textarea.fill('One two three four.');
    
    // Wait for react render
    await expect(page.locator('.font-extrabold.text-3xl.text-blue-600').first()).toContainText('4'); // Words
    await expect(page.locator('.font-extrabold.text-3xl.text-purple-600').first()).toContainText('19'); // Characters
  });

});
