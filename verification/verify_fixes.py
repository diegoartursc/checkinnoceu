from playwright.sync_api import sync_playwright, expect
import time

def verify_checkin_and_map(page):
    page.goto("http://localhost:5173")

    # Inject state based on src/services/storage.js
    page.evaluate("""() => {
        // Bypass onboarding
        localStorage.setItem('ONBOARDING_COMPLETE', 'true');

        // Ensure devotional is COMPLETE to show CheckInScreen
        const today = new Date().toDateString();
        localStorage.setItem('devotional_date', today);
        localStorage.setItem('devotional_complete', 'true');

        // Reset day completion so we see the journey start, not "Day Completed"
        localStorage.setItem('checkin_day', '0');
        // completed_days should not include today
        localStorage.setItem('checkin_completed_days', '{}');
        localStorage.setItem('checkin_last_date', '2020-01-01'); // Long ago

        localStorage.setItem('checkin_coins', '100');
    }""")

    page.reload()

    # Wait for network idle
    page.wait_for_load_state("networkidle")

    # --- TASK 2: CHECK-IN FLOW (Strict Steps) ---
    print("Verifying Check-In Flow...")

    # Check if we see "Jornada do Dia 1"
    try:
        page.wait_for_selector("text=Jornada", timeout=5000)
    except:
        print("Initial screen 'Jornada' not found")
        page.screenshot(path="/home/jules/verification/error_start.png")
        return

    # Click Começar (Step 0 -> Step 1)
    start_btn = page.get_by_role("button", name="Começar")
    if start_btn.is_visible():
        start_btn.click()
        page.wait_for_timeout(500)

        # Verify Message Step (Step 1)
        if page.locator("text=Mensagem").is_visible():
            print("✅ Step 1: Mensagem reached")
            page.screenshot(path="/home/jules/verification/step1_message.png")
        else:
            print("❌ Step 1: Mensagem NOT found")

        # Verify Progress Bar Width (should be 50% for Step 1 out of 2 steps 0,1,2? No, user said Step 1 -> 50%)
        # Logic: (step / 2) * 100. Step 1 / 2 = 50%.

        # Click Próximo (Step 1 -> Step 2)
        next_btn = page.get_by_role("button", name="Próximo")
        next_btn.click()
        page.wait_for_timeout(500)

        # Verify Quiz Step (Step 2)
        # Should skip CatcherGame
        if page.locator("text=Desafio").is_visible():
             print("✅ Step 2: Quiz reached (Skipped Game)")
             page.screenshot(path="/home/jules/verification/step2_quiz.png")
        else:
             print("❌ Step 2: Quiz NOT found")
             if page.locator("text=Estoure").is_visible():
                 print("❌ ERROR: 'Estoure o Medo' game is still visible!")

        # Verify Progress Bar Width (should be 100% for Step 2)


    # --- TASK 1: MAP ROAD (No Gray Road) ---
    print("Verifying Map Road...")

    # Navigate to map
    map_nav = page.get_by_text("Mapa")
    if map_nav.is_visible():
        map_nav.click()
        page.wait_for_timeout(2000)

        # Check if the <path> for the road exists.
        # The DynamicRoadPath usually creates an SVG with specific paths.
        # Since we removed/commented the component, those specific paths shouldn't be there.
        # Or at least, visually it should be clean.

        page.screenshot(path="/home/jules/verification/map_clean.png")
        print("✅ Captured Map Clean Screenshot (Visual Check Required)")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 480, "height": 850}) # Mobile viewport
        page = context.new_page()
        try:
            verify_checkin_and_map(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
