from playwright.sync_api import sync_playwright, expect
import time

def verify_changes(page):
    page.goto("http://localhost:5173")

    # Inject state
    page.evaluate("""() => {
        localStorage.setItem('ONBOARDING_COMPLETE', 'true');
        localStorage.setItem('lastCompletedDate', '2020-01-01T00:00:00.000Z');
        localStorage.setItem('checkin_streak', '0');
        localStorage.setItem('checkin_coins', '100');

        const today = new Date().toISOString().split('T')[0];
        const devotionalState = {
            morningPrayerDone: true,
            gratitudeDone: true,
            goodActionCompleted: true,
            nightPrayerDone: false,
            lastMorningPrayerDate: today,
            lastGratitudeDate: today,
            lastGoodActionDate: today
        };
        localStorage.setItem('devotional_status_v2', JSON.stringify(devotionalState));
    }""")

    page.reload()

    # Wait for network idle to ensure assets loaded
    page.wait_for_load_state("networkidle")

    # Take debug screenshot of initial state
    page.screenshot(path="/home/jules/verification/debug_initial_load.png")

    # Try to find the CheckInScreen content
    # It might be behind a "Loading" state or similar?
    # Or maybe 'Jornada' is not the text.

    # Let's check if we are on the Map or somewhere else.
    if page.locator("text=Mapa").is_visible():
        print("Found Map text, we might be on Map screen?")

    # Check for CheckIn specific elements
    if page.locator("text=Jornada").is_visible():
        print("Found Jornada text")
    else:
        print("Jornada text NOT found")
        # Maybe we are in the Devotional flow?
        if page.locator("text=Oração").is_visible():
            print("Found Oração - we are in devotional flow")

    # --- TASK 3: DESKTOP LAYOUT ---
    page.screenshot(path="/home/jules/verification/desktop_layout_checkin.png")

    # --- TASK 2: CHECK-IN FLOW ---
    # Attempt to click Começar if it exists
    start_btn = page.get_by_role("button", name="Começar")
    if start_btn.is_visible():
        start_btn.click()
        time.sleep(1)
        page.screenshot(path="/home/jules/verification/checkin_step1_message.png")

        next_btn = page.get_by_role("button", name="Próximo")
        if next_btn.is_visible():
            next_btn.click()
            time.sleep(1)
            page.screenshot(path="/home/jules/verification/checkin_step3_quiz.png")

    # --- TASK 1: ROAD MAP ---
    # Force navigation to map if not there
    page.evaluate("window.location.hash = '#map'") # Usually doesn't work with react router unless hash router
    # Try clicking Map nav item
    map_nav = page.get_by_text("Mapa")
    if map_nav.is_visible():
        map_nav.click()
        time.sleep(2)
        page.screenshot(path="/home/jules/verification/map_road.png")


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Large viewport to check desktop layout
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        try:
            verify_changes(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error_debug.png")
        finally:
            browser.close()
