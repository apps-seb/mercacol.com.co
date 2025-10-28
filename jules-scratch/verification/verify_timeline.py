
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        try:
            print("Navigating to http://localhost:8080...")
            await page.goto("http://localhost:8080", timeout=15000)

            # Navigate through the survey
            for i in range(1, 12):
                print(f"Advancing from step {i}...")
                current_step_id = f"#step-{i}"
                await page.wait_for_selector(current_step_id, state="visible", timeout=5000)

                if i == 10:
                    # On step 10, we click the summary confirmation button
                    print("Clicking summary confirmation button...")
                    await page.click("#btn-demo-summary-confirm")
                elif i == 11:
                    # On step 11, we click the demo confirmation button
                    print("Clicking demo confirmation button...")
                    await page.click("#btn-demo-confirm")
                else:
                    # For all other steps, click the main 'next' button
                    print("Clicking 'Next' button...")
                    await page.click("#btn-next")

                # A short wait to allow the next step to transition in
                await page.wait_for_timeout(500)

            print("Waiting for timeline container...")
            await page.wait_for_selector("#timeline-container-horizontal", state="visible", timeout=10000)

            print("Waiting for timeline animation to complete...")
            await page.wait_for_selector("#timeline-node-3.active", state="attached", timeout=10000)

            await page.wait_for_timeout(1000)

            screenshot_path = "jules-scratch/verification/timeline_verification.png"
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot taken successfully and saved to {screenshot_path}")

        except Exception as e:
            print(f"An error occurred: {e}")
            # Take a screenshot on error to help debug
            await page.screenshot(path="jules-scratch/verification/error_screenshot.png")
            print("Error screenshot taken.")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
