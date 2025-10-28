const { test, expect } = require('@playwright/test');

test.describe('Corrected Survey Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/index.html');
  });

  test('should navigate the entire survey, submit, and verify history', async ({ page }) => {
    // Wait for the first step to be visible
    await page.waitForSelector('#step-1.step-visible', { timeout: 10000 });

    // Step 1 -> 10 (Clicking Next)
    // We need to click 'Siguiente' 9 times to get to step 10
    for (let i = 0; i < 9; i++) {
        await page.click('#btn-next');
        await page.waitForSelector(`#step-${i + 2}.step-visible`);
    }

    // Step 10: Demo Summary
    await page.click('#btn-demo-summary-confirm');
    await page.waitForSelector('#step-11.step-visible');

    // Step 11: Demo Confirm
    await page.click('#btn-demo-confirm');
    await page.waitForSelector('#step-12.step-visible');

    // Step 12 -> 16 (Clicking Next)
    // We are on step 12, need to get to 16.
    for (let i = 12; i < 16; i++) {
        await page.click('#btn-next');
        await page.waitForSelector(`#step-${i + 1}.step-visible`);
    }

    // Step 16: Fill contact form
    await page.fill('#nombre_completo', 'Test User');
    await page.fill('#whatsapp', '3001112233');
    await page.fill('#email', 'test.user@example.com');
    await page.fill('#direccion', 'Test Store');

    // Click Finish
    await page.click('#btn-finish');

    // Step 17: Verify thank you message
    await page.waitForSelector('#step-17.step-visible');

    // Verify survey resets to step 1
    await page.waitForSelector('#step-1.step-visible', { timeout: 5000 });

    // Verify history
    await page.click('#history-toggle-button');
    await page.waitForSelector('#history-section.view-section:not(.hidden)');

    const historyContent = page.locator('#user-list-container');
    await expect(historyContent).toContainText('Test User');
    await expect(historyContent).toContainText('Test Store');
    await expect(historyContent).toContainText('3001112233');
  });
});
