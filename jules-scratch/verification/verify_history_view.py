
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navegar a la página principal de la aplicación
        await page.goto("file:///app/index.html")

        # Localizar y hacer clic en el botón de historial/carrito
        history_button = page.locator("#history-toggle-button")
        await expect(history_button).to_be_visible()
        await history_button.click()

        # Esperar a que la sección de historial sea visible
        history_section = page.locator("#history-section")
        await expect(history_section).to_be_visible()

        # Verificar que el título "Historial de Pedidos" esté presente
        await expect(page.get_by_role("heading", name="Historial de Pedidos")).to_be_visible()

        # Tomar una captura de pantalla de la vista de historial
        await page.screenshot(path="jules-scratch/verification/history_view.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
