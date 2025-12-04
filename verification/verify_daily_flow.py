from playwright.sync_api import sync_playwright

def verify_daily_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport to match the app's design
        context = browser.new_context(viewport={"width": 375, "height": 812})
        page = context.new_page()

        try:
            # 1. Start App - Check "Jornada do Dia 1"
            print("Navigating to app...")
            page.goto("http://localhost:5173")
            page.wait_for_timeout(3000) # Wait for initial load

            # Verify we are at Step 0: Jornada do Dia 1
            print("Verifying Step 0: Jornada do Dia 1")
            page.wait_for_selector('text="Jornada"')
            page.wait_for_selector('text="do Dia 1"')
            page.screenshot(path="verification/01_jornada_intro.png")

            # 2. Click "Começar" -> Go to Morning Prayer
            print("Clicking Começar...")
            page.get_by_text("Começar").click()
            page.wait_for_timeout(1000)

            # Verify Step 1: Morning Prayer
            print("Verifying Step 1: Morning Prayer")
            page.wait_for_selector('text="Oração da Manhã"')
            page.screenshot(path="verification/02_morning_prayer.png")

            # 3. Click "Continuar" -> Go to Gratitude
            print("Clicking Continuar...")
            page.get_by_text("Continuar ✨").click()
            page.wait_for_timeout(1000)

            # Verify Step 2: Gratitude
            print("Verifying Step 2: Gratitude")
            page.wait_for_selector('text="Momento de Gratidão"')
            page.screenshot(path="verification/03_gratitude.png")

            # Select an option to proceed
            page.get_by_text("Saúde").click()
            page.get_by_text("Continuar com Gratidão 💜").click()
            page.wait_for_timeout(1000)

            # Verify Step 3: Good Action
            print("Verifying Step 3: Good Action")
            page.wait_for_selector('text="Boa Ação do Dia"')
            page.screenshot(path="verification/04_good_action.png")

            # Complete Good Action
            page.get_by_text("Marcar como Feita ✅").click()
            page.wait_for_timeout(2000) # Wait for animation

            # Verify Step 4: Daily Message
            print("Verifying Step 4: Daily Message")
            page.wait_for_selector('text="Mensagem"', timeout=5000)
            page.screenshot(path="verification/05_daily_message.png")

            # Click Next
            page.get_by_text("Próximo").click()
            page.wait_for_timeout(1000)

            # Verify Step 5: Quiz
            print("Verifying Step 5: Quiz")
            page.wait_for_selector('text="Desafio"')
            page.screenshot(path="verification/06_quiz.png")

            # Select correct answer (Assuming logic is stable, checking for an option)
            # We need to click a button that is part of the quiz.
            # Since content is dynamic, we just click the first option and see if we can finalize.
            # Actually, we need to know the correct answer or guess.
            # Let's try clicking options until "Finalizar" appears.

            options = page.locator("button.text-left")
            count = options.count()
            print(f"Found {count} options")

            if count > 0:
                # Try first option
                options.nth(0).click()
                page.wait_for_timeout(500)

                # Check if "Finalizar" button is enabled/visible
                finalize_btn = page.get_by_text("Finalizar")
                if not finalize_btn.is_visible():
                     # Try second option if first was wrong (button would say "Tente de novo" or be disabled)
                     options.nth(1).click()
                     page.wait_for_timeout(500)

                if finalize_btn.is_visible():
                    finalize_btn.click()
                else:
                    # Try third
                    options.nth(2).click()
                    page.wait_for_timeout(500)
                    finalize_btn.click()

            page.wait_for_timeout(2000)

            # Verify Step 6: Completion
            print("Verifying Step 6: Completion")
            page.wait_for_selector('text="Dia Completado!"')
            page.wait_for_selector('text="Visite seu amiguinho na aba Lar"')
            page.screenshot(path="verification/07_completed.png")

            # Verify Lar tab is clickable (or at least unlocked visually, though difficult to test visual unlock without logic check)
            # The test script ends here as per requirements.

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_daily_flow()
