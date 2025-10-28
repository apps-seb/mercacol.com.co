
import { chromium } from 'playwright';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const VERIFICATION_DIR = 'jules-scratch/verification';
const HTML_FILE_PATH = `file://${path.resolve(process.cwd(), 'index.html')}`;
const UNIQUE_USER_NAME = `Test User ${uuidv4()}`;

async function verifyFullFlow() {
  let browser;
  let page;
  try {
    console.log('Launching browser...');
    browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();

    // Capture console logs from the browser
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

    // Set a longer timeout for potential Firestore delays
    page.setDefaultTimeout(60000);

    console.log(`Navigating to ${HTML_FILE_PATH}...`);
    await page.goto(HTML_FILE_PATH);

    // --- 1. Fill out the survey ---
    console.log('Filling out the survey...');
    await page.click('#btn-next'); // Step 1 -> 2
    await page.check('input[value="plaza"]');
    await page.click('#btn-next'); // Step 2 -> 3
    await page.check('input[value="tiempo"]');
    await page.click('#btn-next'); // Step 3 -> 4
    await page.selectOption('select[name="ubicacion"]', 'comuna_5');
    await page.click('#btn-next'); // Step 4 -> 5
    await page.check('input[value="manana_temprano"]');
    await page.click('#btn-next'); // Step 5 -> 6 (Demo start)
    await page.click('#btn-next'); // Step 6 -> 7
    await page.click('#btn-next'); // Step 7 -> 8
    await page.click('#btn-next'); // Step 8 -> 9
    await page.click('#btn-next'); // Step 9 -> 10
    await page.click('#btn-demo-summary-confirm'); // Step 10 -> 11
    await page.waitForTimeout(1000);
    await page.click('#btn-demo-confirm'); // Step 11 -> 12
    await page.waitForTimeout(4000); // Wait for timeline animation
    await page.click('#btn-next'); // Step 12 -> 13
    await page.check('input[value="muy_util"]');
    await page.click('#btn-next'); // Step 13 -> 14
    await page.check('input[value="precio_justo"]');
    await page.check('input[value="entrega"]');
    await page.click('#btn-next'); // Step 14 -> 15
    await page.check('input[value="credito"]');
    await page.click('#btn-next'); // Step 15 -> 16 (Final form)

    console.log(`Entering unique name: ${UNIQUE_USER_NAME}`);
    await page.fill('#nombre_completo', UNIQUE_USER_NAME);
    await page.fill('#whatsapp', '3005551234');
    await page.fill('#email', `${uuidv4()}@test.com`);
    await page.fill('#direccion', 'Tienda de Prueba');

    // --- 2. Submit and verify reset ---
    console.log('Submitting the survey...');
    await page.click('#btn-finish');

    console.log('Waiting for thank you page and auto-reset...');
    await page.waitForSelector('#step-17.step-visible', { timeout: 10000 });
    console.log('Thank you page is visible.');
    await page.waitForSelector('#step-1.step-visible', { timeout: 10000 });
    console.log('Survey has been reset to step 1.');

    // --- 3. Check history ---
    console.log('Checking the history section...');
    await page.click('#history-toggle-button');
    await page.waitForSelector('#history-section:not(.hidden)');

    console.log('Waiting for the new user to appear in the history...');
    const userCardLocator = page.locator(`h4:text("${UNIQUE_USER_NAME}")`);
    await userCardLocator.waitFor({ state: 'visible', timeout: 20000 });

    console.log('New user found in history!');
    const historyScreenshotPath = path.join(VERIFICATION_DIR, 'history_with_new_user.png');
    await page.screenshot({ path: historyScreenshotPath });
    console.log(`Screenshot of history saved to: ${historyScreenshotPath}`);

    console.log('Verification successful!');

  } catch (error) {
    console.error('An error occurred during verification:', error);
    if (page) {
        await page.screenshot({ path: path.join(VERIFICATION_DIR, 'error_screenshot.png') });
    }
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
}

verifyFullFlow();
