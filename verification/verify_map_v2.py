from playwright.sync_api import sync_playwright

def verify_map_screen(page):
    # Go to the local dev server
    page.goto("http://localhost:5173")

    # Wait for check-in screen to load
    page.wait_for_selector('text=HOJE', timeout=10000)

    # Click on the "Caminho" (Map) tab in BottomNav
    page.click('text=CAMINHO')

    # Wait for the map to load (look for "Minha Jornada" or a Cloud)
    page.wait_for_selector('text=Minha Jornada', timeout=10000)

    # Take a screenshot
    page.screenshot(path="verification/map_screen.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 480, 'height': 800}) # Mobile view
        try:
            verify_map_screen(page)
            print("Screenshot taken successfully")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
