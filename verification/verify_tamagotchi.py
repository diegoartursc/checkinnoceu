from playwright.sync_api import sync_playwright

def verify_tamagotchi():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use mobile viewport to match app design
        context = browser.new_context(viewport={'width': 375, 'height': 812})
        page = context.new_page()

        # 1. Load the app
        print("Loading app...")
        page.goto("http://localhost:5173")

        # 2. Wait for app to load (checking for main container)
        print("Waiting for load...")
        page.wait_for_selector(".min-h-screen", timeout=10000)

        # 3. Handle Onboarding if it appears (Pet Selection)
        # Check if we are in onboarding or main screen
        try:
             # If "Bem-vindo" or pet selection is visible
             if page.get_by_text("Escolha seu amiguinho").is_visible():
                 print("Onboarding detected. Selecting pet...")
                 page.get_by_text("Ovelhinha").click()
                 page.get_by_role("button", name="Começar Jornada").click()
                 page.wait_for_timeout(1000)
        except:
             print("No onboarding or error handling it.")

        # 4. Check if we are in Devotional Flow (Morning Prayer)
        # We need to bypass devotional to get to Lar Screen
        # Or maybe we can just verify the Lar Screen if we can navigate there
        # Since the app forces devotional, we might need to click through it.

        print("Checking for Devotional flow...")
        if page.get_by_text("Oração da Manhã").is_visible():
             print("Completing Morning Prayer...")
             # Click confirm/next buttons
             # Assuming there is a button to complete
             # Looking at MorningPrayerScreen.jsx logic (not visible here but assuming 'Amém' or similar)
             # Let's try to find a button at the bottom
             page.get_by_role("button").last.click()
             page.wait_for_timeout(1000)

        # Use more specific locators or first() to avoid strict mode errors
        if page.get_by_text("Gratidão").first.is_visible():
             print("Completing Gratitude...")
             # Gratitude usually requires typing something or selecting something before button is enabled
             # Let's try to type "Obrigado" in a textarea if it exists
             if page.get_by_role("textbox").count() > 0:
                 page.get_by_role("textbox").fill("Obrigado")
                 page.wait_for_timeout(500)
             page.get_by_role("button").last.click()
             page.wait_for_timeout(1000)

        if page.get_by_text("Boa Ação").first.is_visible():
             print("Completing Good Action...")
             page.get_by_role("button").last.click()
             page.wait_for_timeout(2000)

        # 5. Now we should be at Main Layout (CheckIn or Map)
        # Navigate to Lar Screen (Home icon usually or specific nav item)
        print("Navigating to Lar Screen...")
        # The navigation bar is usually at the bottom.
        # "Lar" button.
        # Use last() or more specific selector to hit the button, not the header if already there
        if page.get_by_text("Lar").count() > 0:
             page.get_by_text("Lar").last.click()
        page.wait_for_timeout(1000)

        # 6. Verify Pet Elements
        print("Verifying Tamagotchi elements...")

        # Take screenshot of Lar Screen
        page.screenshot(path="verification/tamagotchi_screen.png")
        print("Screenshot saved to verification/tamagotchi_screen.png")

        # Verify Stage Text
        stage_text = page.get_by_text("Fase: FILHOTE").is_visible()
        print(f"Stage Text Visible: {stage_text}")

        # Verify Stats Bars (by looking for emojis)
        # Use first() because emojis appear in buttons too
        hunger_visible = page.get_by_text("🍽️").first.is_visible()
        fun_visible = page.get_by_text("🎾").first.is_visible() # Tennis ball for Fun/Play
        energy_visible = page.get_by_text("⚡").first.is_visible()

        print(f"Hunger Visible: {hunger_visible}")
        print(f"Fun Visible: {fun_visible}")
        print(f"Energy Visible: {energy_visible}")

        # Verify Action Buttons
        feed_btn = page.get_by_text("COMER").is_visible()
        play_btn = page.get_by_text("BRINCAR").is_visible()
        rest_btn = page.get_by_text("DESCANSAR").is_visible()

        print(f"Feed Button Visible: {feed_btn}")
        print(f"Play Button Visible: {play_btn}")
        print(f"Rest Button Visible: {rest_btn}")

        browser.close()

if __name__ == "__main__":
    verify_tamagotchi()
