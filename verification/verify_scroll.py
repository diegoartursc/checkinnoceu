from playwright.sync_api import sync_playwright

def verify_morning_prayer_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport to match the target device
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        try:
            # Navigate to local dev server
            page.goto("http://localhost:5173")

            # Wait for content to load
            page.wait_for_selector('text=Oração da Manhã', timeout=10000)

            # Take screenshot of initial state (top of scroll)
            page.screenshot(path="verification/morning_prayer_top.png")
            print("Captured top of Morning Prayer")

            # Attempt to scroll down
            # We target the central scrollable area.
            # Since we removed global scroll, we expect 'main' inside MainLayout to scroll

            # Locate the scrollable container (it's the 'main' tag in MainLayout)
            scrollable_container = page.locator('main')

            # Scroll to bottom of the container
            scrollable_container.evaluate("element => element.scrollTop = element.scrollHeight")

            # Wait a bit for scroll and any lazy load (though none expected)
            page.wait_for_timeout(500)

            # Take screenshot of scrolled state
            page.screenshot(path="verification/morning_prayer_bottom.png")
            print("Captured bottom of Morning Prayer")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_morning_prayer_layout()
