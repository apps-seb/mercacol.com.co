from playwright.sync_api import sync_playwright, expect

def run_verification(page):
    # Navigate to the local index.html file
    page.goto(f"file:///app/index.html")

    # Click the history toggle button to show the history section
    history_button = page.locator("#history-toggle-button")
    expect(history_button).to_be_visible()
    history_button.click()

    # Verify that the export buttons and date inputs are visible
    expect(page.locator("#export-pdf")).to_be_visible()
    expect(page.locator("#export-excel")).to_be_visible()
    expect(page.locator("#start-date")).to_be_visible()
    expect(page.locator("#end-date")).to_be_visible()

    # Take a screenshot of the history section with the export options
    page.screenshot(path="jules-scratch/verification/history_section_verification.png")

    # Click the close button to go back to the survey
    close_button = page.locator("#close-icon")
    expect(close_button).to_be_visible()
    close_button.click()

    # Navigate to step 4 of the survey
    for i in range(3):
        page.locator("#btn-next").click()

    # Verify that the new neighborhood dropdown is visible
    neighborhood_selector = page.locator('select[name="ubicacion"]')
    expect(neighborhood_selector).to_be_visible()

    # Take a screenshot of the form with the neighborhood dropdown
    page.screenshot(path="jules-scratch/verification/neighborhood_dropdown_verification.png")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    run_verification(page)
    browser.close()
