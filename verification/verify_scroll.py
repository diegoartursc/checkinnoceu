from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport to test the layout
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        try:
            # 1. Navigate to app
            page.goto("http://localhost:5174")

            # Wait for content
            page.wait_for_selector('text=Oração da Manhã', timeout=10000)

            # 3. Complete Devotional Flow
            page.get_by_text("Ouvir Oração 🎵").click()
            page.wait_for_timeout(3100)
            page.get_by_text("Continuar ✨").click()

            page.get_by_text("Minha Família").click()
            page.get_by_text("Continuar com Gratidão 💜").click()

            page.get_by_text("Marcar como Feita ✅").click()
            page.wait_for_timeout(2000)

            # 4. Now at CheckIn Screen
            expect(page.get_by_text("Jornada")).to_be_visible()

            # Debug BottomNav
            btn = page.get_by_role("button", name="CAMINHO")

            # Check visibility
            if btn.is_visible():
                print("Button is considered visible by Playwright")
            else:
                print("Button is NOT visible")

            box = btn.bounding_box()
            print(f"CAMINHO Button Bounding Box: {box}")

            viewport = page.viewport_size
            print(f"Viewport: {viewport}")

            if box:
                if box['y'] >= viewport['height']:
                    print(f"Button is below viewport! y={box['y']} >= {viewport['height']}")
                elif box['y'] + box['height'] <= 0:
                    print(f"Button is above viewport! y={box['y']}")
                else:
                    print("Button coordinates look OK.")

            # Try force click
            print("Attempting force click...")
            btn.click(force=True)
            print("Force clicked CAMINHO")

            page.wait_for_timeout(1000)

            # Verify Map visible
            expect(page.get_by_text("Caminho da Vida")).to_be_visible()

            # Screenshot of Map
            page.screenshot(path="verification/map_screen.png")
            print("Screenshot saved: verification/map_screen.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
