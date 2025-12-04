
import os
from playwright.sync_api import sync_playwright

def verify_map_no_road():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a mobile viewport context
        context = browser.new_context(viewport={'width': 375, 'height': 667})
        page = context.new_page()

        try:
            # Navigate to app
            page.goto("http://localhost:5173")
            page.wait_for_load_state("networkidle")

            # Navigate to Caminho tab
            # Using partial text matching as fail-safe
            page.get_by_text("Caminho", exact=False).first.click()
            page.wait_for_timeout(2000) # Wait for animation

            # Take screenshot
            os.makedirs("verification", exist_ok=True)
            screenshot_path = "verification/map_no_road.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_map_no_road()
