
import time
from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 480, 'height': 850},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        )
        page = context.new_page()

        # Pre-fill storage to bypass onboarding and set coins/state
        page.add_init_script("""
            localStorage.setItem('ONBOARDING_COMPLETE', 'true');
            localStorage.setItem('checkin_coins', '100');
            localStorage.setItem('checkin_pet', JSON.stringify({
                type: 'ovelhinha',
                name: 'Ovelhinha',
                hunger: 100,
                happiness: 100,
                energy: 5  // Low energy to test if button is enabled
            }));
        """)

        try:
            # 1. Open App
            page.goto("http://localhost:5173")
            page.wait_for_selector('text=HOJE', timeout=10000)

            # 2. Go to Lar
            print("Navigating to Lar...")
            page.click('text=LAR')
            page.wait_for_timeout(1000) # Wait for animation
            page.screenshot(path="verification/lar_screen.png")

            # 3. Check Brincar button
            print("Checking Brincar button...")
            brincar_btn = page.locator('button:has-text("BRINCAR")')

            # Verify it is enabled even with low energy (energy set to 5 in init script)
            if brincar_btn.is_disabled():
                print("ERROR: Brincar button is disabled!")
            else:
                print("SUCCESS: Brincar button is enabled.")

            # 4. Open Game Hub
            print("Opening Game Hub...")
            brincar_btn.click()
            page.wait_for_selector('text=Minigames', timeout=5000)
            page.screenshot(path="verification/game_hub.png")

            # 5. Check Games List
            games = page.locator('text=Pares da Arca')
            if games.count() > 0:
                print("SUCCESS: Game Hub loaded with games.")
            else:
                print("ERROR: Game Hub empty or games not found.")

            # 6. Close Hub
            page.click('button:has-text("Minigames") + button') # Close button usually next to title or look for X
            # Alternatively use the X icon selector if possible, but simplistic click might work if X is distinct.
            # Let's try clicking the backdrop or specific close button if needed.
            # Using generic click on X button:
            page.locator('button:has(svg.lucide-x)').click()

            # 7. Go to Settings
            print("Navigating to Settings...")
            page.click('text=AJUSTES')
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/settings_screen.png")

            # 8. Check Settings Content
            if page.locator('text=Suporte').is_visible() and page.locator('text=Preferências').is_visible():
                print("SUCCESS: Settings screen loaded new design.")
            else:
                print("ERROR: Settings screen missing content.")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")

        finally:
            browser.close()

if __name__ == "__main__":
    verify_changes()
