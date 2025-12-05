
import time
from playwright.sync_api import sync_playwright

def verify_settings():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 480, 'height': 850},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        )
        page = context.new_page()

        # Pre-fill storage
        page.add_init_script("""
            localStorage.setItem('ONBOARDING_COMPLETE', 'true');
        """)

        try:
            # 1. Open App
            page.goto("http://localhost:5173")
            page.wait_for_selector('text=HOJE', timeout=10000)

            # 2. Go to Settings
            print("Navigating to Settings...")
            page.click('text=AJUSTES')
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/settings_screen_final.png")

            # 3. Check Settings Content
            # Look for the new header text "Ajustes" and "Configure seu app"
            if page.locator('text=Configure seu app').is_visible():
                print("SUCCESS: Settings screen header verified.")
            else:
                print("ERROR: Settings screen header mismatch.")

            # Look for 3D buttons (Central de Ajuda)
            if page.locator('text=Central de Ajuda').is_visible():
                print("SUCCESS: Support section verified.")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/settings_error.png")

        finally:
            browser.close()

if __name__ == "__main__":
    verify_settings()
