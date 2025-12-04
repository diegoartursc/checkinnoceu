from playwright.sync_api import sync_playwright

def verify_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Desktop Verification
        page_desktop = browser.new_page(viewport={'width': 1440, 'height': 900})
        # Mock local storage to ensure we land on a meaningful screen (e.g. valid user)
        page_desktop.add_init_script("""
            localStorage.setItem('user-storage', JSON.stringify({
                state: {
                    name: 'TestUser',
                    onboardingCompleted: true,
                    devotionalStatus: {
                        morningPrayerDone: false
                    }
                },
                version: 0
            }));
        """)

        try:
            page_desktop.goto("http://localhost:5173", timeout=30000)
            page_desktop.wait_for_load_state("networkidle")
            # Wait for content
            page_desktop.wait_for_selector('text=HOJE', timeout=10000)

            page_desktop.screenshot(path="verification/desktop_layout.png")
            print("Desktop screenshot captured.")

        except Exception as e:
            print(f"Desktop verification failed: {e}")

        # 2. Mobile Verification
        page_mobile = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        page_mobile.add_init_script("""
             localStorage.setItem('user-storage', JSON.stringify({
                state: {
                    name: 'TestUser',
                    onboardingCompleted: true,
                    devotionalStatus: {
                        morningPrayerDone: false
                    }
                },
                version: 0
            }));
        """)

        try:
            page_mobile.goto("http://localhost:5173", timeout=30000)
            page_mobile.wait_for_load_state("networkidle")
             # Wait for content
            page_mobile.wait_for_selector('text=HOJE', timeout=10000)

            page_mobile.screenshot(path="verification/mobile_layout.png")
            print("Mobile screenshot captured.")

        except Exception as e:
            print(f"Mobile verification failed: {e}")

        browser.close()

if __name__ == "__main__":
    verify_layout()
