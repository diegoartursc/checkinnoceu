from playwright.sync_api import sync_playwright, expect
import time

def verify_changes(page):
    # 1. Setup State in LocalStorage (Mock User)
    # We need:
    # - onboardingCompleted: 'true'
    # - devotionalComplete: 'true' (to skip devotional flow and see main screens)
    # - lastCompletedDay: '0'

    # Define state to inject
    state = {
        "ONBOARDING_COMPLETE": "true",
        "devotional_status_v2": '{"morningPrayerDone":true,"gratitudeDone":true,"goodActionCompleted":true,"nightPrayerDone":false,"lastMorningPrayerDate":"2024-01-01","lastGratitudeDate":"2024-01-01","lastGoodActionDate":"2024-01-01"}', # Mock old date to ensure it resets or just force it
    }

    # We actually want `devotionalComplete` to be FALSE to test the CheckIn flow logic?
    # Wait, the user said "Check-in Flow" - implies the `CheckInScreen`.
    # `CheckInScreen` is rendered when `screen === 'checkin'` AND `devotionalComplete` is TRUE?
    # No, look at `AppContent.jsx`:
    # If `!devotionalComplete`, it renders `MorningPrayerScreen`, etc.
    # If `devotionalComplete`, it renders `MainLayout` with `CheckInScreen` (if screen='checkin').

    # BUT, the `CheckInScreen` has the "Começar" button which STARTS the flow usually?
    # Actually, looking at `CheckInScreen.jsx`, it has steps: 0 (Intro), 1 (Message), 2 (Game - REMOVED), 3 (Quiz).
    # And it has a "Começar" button.
    # The `CheckInScreen` we modified is the one inside the `devotionalComplete` block?
    # Let's re-read AppContent.jsx carefully.

    # AppContent.jsx:
    # if (!devotionalComplete) { return <MainLayout>...<MorningPrayerScreen/></MainLayout> }
    # else { return <MainLayout> ... <CheckInScreen ... /> ... </MainLayout> }

    # Wait, if `devotionalComplete` is false, we see Prayer/Gratitude/Action.
    # If `devotionalComplete` is true, we see CheckInScreen.
    # BUT `CheckInScreen` is the "Jornada do Dia X".
    # Isn't "devotional" the Morning Prayer?
    # The user Context has `devotionalComplete`.

    # The `CheckInScreen` we edited has "Mensagem", "Estoure o Medo", "Quiz".
    # This looks like the "Daily Journey" (Jornada do Dia).

    # So we want `devotionalComplete` to be TRUE so we can see the `CheckInScreen`.
    # And we want `isCompletedToday` to be FALSE so we can see the "Começar" button.

    # Inject state before load
    page.goto("http://localhost:5173")

    page.evaluate("""() => {
        localStorage.setItem('ONBOARDING_COMPLETE', 'true');
        // We set a past date for the last completion so 'isCompletedToday' is false
        localStorage.setItem('lastCompletedDate', '2020-01-01T00:00:00.000Z');
        localStorage.setItem('checkin_streak', '0');
        localStorage.setItem('checkin_coins', '100');

        // We need 'devotionalComplete' to be true to see CheckInScreen
        // In UserContext, 'devotionalComplete' is derived from:
        // morningPrayerDone && gratitudeDone && goodActionCompleted
        // So let's set them all to true for TODAY.
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

    # Reload to apply state
    page.reload()

    # Wait for app to load
    page.wait_for_selector("text=Jornada")

    # --- TASK 3 VERIFICATION: DESKTOP LAYOUT ---
    # Check if the body background is dark slate (approx #0f172a / rgb(15, 23, 42))
    # And if the app container is centered.

    # Take screenshot of the CheckIn Screen (Desktop Layout)
    page.screenshot(path="/home/jules/verification/desktop_layout_checkin.png")

    # --- TASK 2 VERIFICATION: CHECK-IN FLOW ---
    # 1. Click "Começar"
    page.get_by_role("button", name="Começar").click()

    # 2. Should be on "Mensagem" step (Step 1)
    # Check Progress Bar width ~ 66%
    # We can check the style attribute of the bar
    progress_bar = page.locator(".bg-yellow-400").first
    # expect(progress_bar).to_have_css("width", "66%") # CSS value might be pixels in computed, let's just check visually or via attribute if possible

    page.wait_for_timeout(500)
    page.screenshot(path="/home/jules/verification/checkin_step1_message.png")

    # 3. Click "Próximo"
    page.get_by_role("button", name="Próximo").click()

    # 4. Should be on "Quiz" step (Step 3) - SKIPPING GAME
    # Look for "Desafio" or the question text
    expect(page.get_by_text("Desafio")).to_be_visible()

    # Check Progress Bar width ~ 100%
    page.screenshot(path="/home/jules/verification/checkin_step3_quiz.png")

    # --- TASK 1 VERIFICATION: ROAD MAP ---
    # We need to navigate to the map.
    # Usually navigation is at the bottom.
    page.get_by_text("Mapa").click()

    # Wait for Map to load
    page.wait_for_selector("svg") # The road is an SVG

    # Take screenshot of Map to verify no gray squares on road
    # Might need to wait a bit for canvas/svg rendering
    page.wait_for_timeout(2000)
    page.screenshot(path="/home/jules/verification/map_road.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        # Use a desktop viewport size to verify the centering
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        try:
            verify_changes(page)
            print("Verification script ran successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            browser.close()
