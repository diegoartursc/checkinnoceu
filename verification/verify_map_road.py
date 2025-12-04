from playwright.sync_api import sync_playwright

def verify_map_road():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use Desktop viewport to test the mobile frame fix
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        try:
            print("Navigating to app on port 5173...")
            page.goto("http://localhost:5173")

            # Wait for app to load
            print("Waiting for HOJE text...")
            page.wait_for_selector('text=HOJE', state='visible', timeout=15000)
            print("App loaded.")

            # Click on 'Caminho' tab (Map)
            print("Clicking Caminho tab...")

            # Try to find the Caminho button more robustly
            caminho_btn = page.get_by_role("button", name="Caminho")
            if not caminho_btn.count():
                 print("Role button failed, trying text...")
                 caminho_btn = page.get_by_text("Caminho")

            caminho_btn.click()

            # Wait for map specific element
            print("Waiting for Map to load...")
            # Wait for any map element if title is problematic
            page.wait_for_selector('.lucide-cloud', state='visible', timeout=10000)

            # Wait a bit for layout effect to settle
            page.wait_for_timeout(2000)

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/map_desktop_view.png")
            print("Screenshot saved to verification/map_desktop_view.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_map_road()
