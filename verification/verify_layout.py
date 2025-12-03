from playwright.sync_api import sync_playwright

def verify_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate a mobile device to check the layout
        context = browser.new_context(viewport={'width': 375, 'height': 667})
        page = context.new_page()

        try:
            # Navigate to the local server
            page.goto("http://localhost:5173", timeout=30000)

            # Wait for the root element
            page.wait_for_selector("#root")

            # Get body and html styles
            body_handle = page.query_selector("body")
            html_handle = page.query_selector("html")

            body_style = body_handle.evaluate("element => window.getComputedStyle(element).getPropertyValue('overflow')")
            html_style = html_handle.evaluate("element => window.getComputedStyle(element).getPropertyValue('overflow')")

            print(f"Body overflow: {body_style}")
            print(f"Html overflow: {html_style}")

            # Take a screenshot
            page.screenshot(path="verification/layout_check.png")
            print("Screenshot saved to verification/layout_check.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_layout()
