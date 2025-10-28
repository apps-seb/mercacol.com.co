
import { chromium } from 'playwright';
import path from 'path';

const VERIFICATION_DIR = 'jules-scratch/verification';
const HTML_FILE_PATH = `file://${path.resolve(process.cwd(), 'index.html')}`;

async function verifyTimeline() {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`Navigating to ${HTML_FILE_PATH}...`);
    await page.goto(HTML_FILE_PATH);

    // Navigate to the timeline step (step 12)
    console.log('Navigating to the timeline step...');
    for (let i = 0; i < 11; i++) {
        // Step 10 has a different confirmation button
        if (i === 9) {
             await page.click('#btn-demo-summary-confirm');
             // Wait for the simulated confirmation delay
             await page.waitForTimeout(1000);
        } else if (i === 10) {
            // Step 11 also has a different button
             await page.click('#btn-demo-confirm');
        }
        else {
            await page.click('#btn-next');
        }
       await page.waitForTimeout(50); // Small delay between clicks
    }

    console.log('Waiting for timeline animation...');
    // The animation takes about 4 * 800ms = 3.2 seconds + initial delay
    await page.waitForTimeout(4000);

    const timelineContainer = await page.$('#timeline-container-horizontal');
    if (!timelineContainer) {
        throw new Error('Timeline container not found on step 12.');
    }

    const screenshotPath = path.join(VERIFICATION_DIR, 'timeline_verification.png');
    console.log(`Taking screenshot of the timeline: ${screenshotPath}`);
    await timelineContainer.screenshot({ path: screenshotPath });

    console.log('Verification successful!');

  } catch (error) {
    console.error('An error occurred during verification:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
}

verifyTimeline();
