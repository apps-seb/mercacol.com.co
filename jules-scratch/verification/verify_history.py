from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        page.goto('http://localhost:8080/index.html')

        # Wait for the first step to be visible
        page.wait_for_selector('#step-1.step-visible', timeout=10000)

        # Step 1 -> 10 (Clicking Next)
        for i in range(9):
            page.click('#btn-next')
            page.wait_for_selector(f'#step-{i + 2}.step-visible')

        # Step 10: Demo Summary
        page.click('#btn-demo-summary-confirm')
        page.wait_for_selector('#step-11.step-visible')

        # Step 11: Demo Confirm
        page.click('#btn-demo-confirm')
        page.wait_for_selector('#step-12.step-visible')

        # Step 12 -> 16 (Clicking Next)
        for i in range(12, 16):
            page.click('#btn-next')
            page.wait_for_selector(f'#step-{i + 1}.step-visible')

        # Step 16: Fill contact form
        page.fill('#nombre_completo', 'Verification User')
        page.fill('#whatsapp', '3123456789')
        page.fill('#email', 'verify@example.com')
        page.fill('#direccion', 'Verification Store')

        # Click Finish
        page.click('#btn-finish')

        # Step 17: Verify thank you message
        page.wait_for_selector('#step-17.step-visible')

        # Verify survey resets to step 1
        page.wait_for_selector('#step-1.step-visible', timeout=5000)

        # Verify history
        page.click('#history-toggle-button')
        page.wait_for_selector('#history-section.view-section:not(.hidden)')

        # Take screenshot
        page.screenshot(path='jules-scratch/verification/history_verification.png')

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
