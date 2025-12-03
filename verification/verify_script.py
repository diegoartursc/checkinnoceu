from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (using default vite port)
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000)

        # Step 1: Morning Prayer
        # Check for title
        if page.get_by_role("heading", name="Oração da Manhã").is_visible():
            print("Completing Morning Prayer...")
            page.get_by_role("button", name="Continuar").click()
            page.wait_for_timeout(1000)

        # Step 2: Gratitude
        # Check for title
        if page.get_by_role("heading", name="Gratidão").is_visible():
            print("Completing Gratitude...")

            # Click 3 items. They seem to be buttons or divs.
            # I will try to click on elements that look like cards/buttons in the grid.
            # Assuming they are buttons.

            # If buttons are not explicitly "button" role, might be divs.
            # Let's try to click on the first 3 elements with a specific class or just try coordinates/guessing.

            # Better: locate buttons by exclusion
            buttons = page.get_by_role("button").all()
            clicked = 0
            for btn in buttons:
                txt = btn.text_content()
                # Click if not the continue button
                if txt and "Continuar" not in txt:
                    btn.click()
                    clicked += 1
                    if clicked >= 3:
                        break

            # Now click continue
            page.get_by_role("button", name="Continuar").click()
            page.wait_for_timeout(1000)

        # Step 3: Good Action
        # Check for title
        if page.get_by_role("heading", name="Boa Ação").is_visible():
            print("Completing Good Action...")

            # Click on a card (maybe a button or div)
            # Try clicking center of screen if locator is hard
            page.mouse.click(200, 350)

            # Click confirm
            # Button might contain "Confirmar"
            # It seems the error logs showed "Continuar com Gratidão" earlier, so maybe names are dynamic

            # Look for button that says "Confirmar" or similar
            confirm_btn = page.get_by_role("button", name="Confirmar")
            if confirm_btn.is_visible():
                confirm_btn.click()
            else:
                 # Fallback: click the last button
                 page.get_by_role("button").last.click()

            page.wait_for_timeout(2000)

        # Dashboard Navigation
        print("Navigating to LarScreen...")

        # Swipe CheckIn -> Map -> Lar
        print("Swiping to Map...")
        page.mouse.move(350, 400)
        page.mouse.down()
        page.mouse.move(50, 400, steps=10)
        page.mouse.up()
        page.wait_for_timeout(1000)

        print("Swiping to Lar...")
        page.mouse.move(350, 400)
        page.mouse.down()
        page.mouse.move(50, 400, steps=10)
        page.mouse.up()
        page.wait_for_timeout(1000)

        # Screenshot
        page.screenshot(path="verification/lar_screen.png")
        print("Lar Screen Screenshot taken")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
