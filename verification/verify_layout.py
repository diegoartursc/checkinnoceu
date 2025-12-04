
import time
from playwright.sync_api import sync_playwright

def verify_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate a mobile device to verify the "frame" behavior on desktop viewport
        # However, to check the "Desktop Frame" itself, we should use a desktop viewport size
        # and see if the content is centered and max-width restricted.
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            print("Navigating to app...")
            page.goto("http://localhost:4173")

            # Wait for content to load
            page.wait_for_selector('text=HOJE', timeout=10000)
            time.sleep(2) # Allow animations/transitions to settle

            # 1. Verify "Desktop Frame"
            # The MainLayout inner container should have a max-width and be centered.
            # We can check if the "root" has a dark background and the content is smaller.

            # Take a screenshot of the initial "HOJE" screen in Desktop View
            page.screenshot(path="verification/1_desktop_layout_hoje.png")
            print("Screenshot 1 taken: Desktop layout")

            # 2. Verify "No Side Overflow" when switching screens
            # Click "CAMINHO"
            print("Clicking 'CAMINHO'...")
            page.click('text=CAMINHO')

            time.sleep(1) # Wait for transition (500ms in CSS)

            # Take a screenshot of the "CAMINHO" screen
            page.screenshot(path="verification/2_desktop_layout_caminho.png")
            print("Screenshot 2 taken: Caminho layout")

            # 3. Verify Mobile Viewport Simulation
            # Now resize to mobile to ensure it fills the screen there
            page.set_viewport_size({'width': 375, 'height': 667})
            time.sleep(1)
            page.screenshot(path="verification/3_mobile_layout_caminho.png")
            print("Screenshot 3 taken: Mobile layout")

            # Check for body scroll
            body_overflow = page.evaluate("window.getComputedStyle(document.body).overflow")
            print(f"Body Overflow: {body_overflow}")

            if body_overflow != "hidden":
                print("WARNING: Body overflow is not hidden!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_layout()
