from playwright.sync_api import sync_playwright

def verify_bottom_nav():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to app
        page.goto('http://localhost:5173')

        # Wait for BottomNav
        # It should be visible and fixed
        bottom_nav = page.locator('.fixed.bottom-0')
        bottom_nav.wait_for(state='visible')

        # Check coordinates
        box = bottom_nav.bounding_box()
        print(f"BottomNav bounding box: {box}")

        # Check Z-index
        z_index = bottom_nav.evaluate("el => window.getComputedStyle(el).zIndex")
        print(f"BottomNav z-index: {z_index}")

        # Check if it is inside viewport
        viewport = page.viewport_size
        print(f"Viewport: {viewport}")

        if box['y'] + box['height'] <= viewport['height']:
            print("BottomNav is visible within viewport")
        else:
            print("BottomNav is OFF SCREEN!")

        # Take screenshot
        page.screenshot(path='verification/bottom_nav_fixed.png')

        browser.close()

if __name__ == "__main__":
    verify_bottom_nav()
