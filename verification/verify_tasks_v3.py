from playwright.sync_api import sync_playwright, expect
import time

def verify_changes(page):
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

    # Debug screenshot
    page.screenshot(path="/home/jules/verification/debug_state_v3.png")

    # Check if we see "Jornada do Dia 1"
    try:
        page.wait_for_selector("text=Jornada", timeout=5000)
        print("Found Jornada text")
    except:
        print("Jornada text NOT found - dumping page text")
        print(page.inner_text("body"))

    # --- TASK 3: DESKTOP LAYOUT ---
    page.screenshot(path="/home/jules/verification/desktop_layout_final.png")

    # --- TASK 2: CHECK-IN FLOW ---
    start_btn = page.get_by_role("button", name="Começar")
    if start_btn.is_visible():
        start_btn.click()
        # Verify Message Step (Step 1)
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/checkin_step1.png")

        # Verify Next button goes to Quiz (Step 3)
        next_btn = page.get_by_role("button", name="Próximo")
        next_btn.click()

        # Should skip CatcherGame and go to Quiz
        page.wait_for_timeout(1000)
        if page.locator("text=Desafio").is_visible():
             print("Successfully skipped to Quiz")
        else:
             print("Failed to skip to Quiz or text not found")
        page.screenshot(path="/home/jules/verification/checkin_step3.png")


    # --- TASK 1: ROAD MAP ---
    # To check the map, we need to complete the quiz or navigate
    # Let's try navigating directly if bottom nav is visible
    map_nav = page.get_by_text("Mapa")
    if map_nav.is_visible():
        map_nav.click()
        page.wait_for_timeout(2000)
        page.screenshot(path="/home/jules/verification/map_road_final.png")
        print("Captured Map Road")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        try:
            verify_changes(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
