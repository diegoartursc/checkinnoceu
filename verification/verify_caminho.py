from playwright.sync_api import sync_playwright

def verify_caminho_interactions():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Start - Load App
        print("Loading app...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(3000)

        # 2. Simulate User Data: Devotional NOT Done -> Click Current Day -> Toast
        print("Setting up Case A: Devotional Not Done...")
        page.evaluate("""() => {
            localStorage.setItem('checkin_day', '0');
            localStorage.setItem('devotional_complete', 'false');
            window.location.reload();
        }""")
        page.wait_for_timeout(3000)

        # Try to navigate to Map using BottomNav
        print("Attempting to navigate to Map...")
        try:
             # Click the "CAMINHO" button in BottomNav
             # It contains text "CAMINHO" in a span
             page.locator("button:has-text('CAMINHO')").click(timeout=3000)
             print("Clicked 'CAMINHO' tab.")
             page.wait_for_timeout(2000)
        except:
             print("Could not click 'CAMINHO' tab (maybe blocked by Prayer Screen).")

        page.screenshot(path="verification/step1_map_attempt.png")

        # Click Current Day (Day 1)
        print("Clicking Current Day (Day 1)...")
        try:
            page.get_by_text("1", exact=True).first.click(timeout=5000)
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/step2_toast_devotional_needed.png")
            print("Success: Clicked Day 1.")
        except:
            print("Failed to click Day 1 (Element not found or covered).")

        # 3. Simulate Devotional Done -> Click Current Day -> Open Modal
        print("Setting up Case B: Devotional Done...")
        page.evaluate("""() => {
            localStorage.setItem('devotional_complete', 'true');
            window.location.reload();
        }""")
        page.wait_for_timeout(3000)

        # Navigate to Map again
        print("Navigating to Map again...")
        try:
            page.locator("button:has-text('CAMINHO')").click(timeout=3000)
            page.wait_for_timeout(2000)
        except:
            pass

        print("Clicking Current Day (Day 1) again...")
        try:
            page.get_by_text("1", exact=True).first.click(timeout=5000)
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/step3_caminho_modal_open.png")
            print("Success: Modal Open.")

            # Interact
            page.locator("button:has-text('Coragem')").click()
            page.wait_for_timeout(500)
            page.screenshot(path="verification/step4_modal_feedback.png")

            page.locator("button:has-text('Voltar ao Caminho')").click()
            page.wait_for_timeout(500)
            print("Success: Modal Interaction.")
        except:
            print("Failed to interact with Modal.")

        # 4. Future Day
        print("Clicking Future Day (Day 3)...")
        try:
             page.get_by_text("3", exact=True).first.click(timeout=2000)
             page.wait_for_timeout(1000)
             page.screenshot(path="verification/step5_toast_locked.png")
             print("Success: Future Day Clicked.")
        except:
             print("Failed to click Future Day.")

        browser.close()

if __name__ == "__main__":
    verify_caminho_interactions()
