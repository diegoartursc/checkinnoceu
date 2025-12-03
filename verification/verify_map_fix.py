
import os
import time
from playwright.sync_api import sync_playwright, expect

def verify_map_fix():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate a mobile device
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for app to load
        page.wait_for_timeout(3000)

        # === DEVOTIONAL FLOW ===

        # 1. Morning Prayer
        # Button: "Continuar ✨"
        print("Checking Morning Prayer...")
        try:
             # Look for the specific button
             prayer_continue = page.get_by_role("button", name="Continuar")
             if prayer_continue.is_visible():
                 print("Found Morning Prayer 'Continuar'. Clicking...")
                 prayer_continue.click()
                 page.wait_for_timeout(1000)
             else:
                 print("Morning Prayer not visible (maybe already done?)")
        except Exception as e:
             print(f"Interaction error: {e}")

        # 2. Gratitude Screen
        # Needs selection first.
        print("Checking Gratitude Screen...")
        try:
             # Find "Minha Família" button
             family_btn = page.get_by_text("Minha Família")
             if family_btn.is_visible():
                 print("Found 'Minha Família'. Selecting...")
                 family_btn.click()
                 page.wait_for_timeout(500)

                 # Now click Continue
                 gratitude_continue = page.get_by_role("button", name="Continuar com Gratidão")
                 gratitude_continue.click()
                 page.wait_for_timeout(1000)
             else:
                 print("Gratitude screen not visible.")
        except Exception as e:
             print(f"Interaction error: {e}")

        # 3. Good Action Screen
        print("Checking Good Action Screen...")
        try:
             done_btn = page.get_by_role("button", name="Marcar como Feita")
             if done_btn.is_visible():
                 print("Found 'Marcar como Feita'. Clicking...")
                 done_btn.click()
                 # Good Action has a 1500ms timeout before completing
                 page.wait_for_timeout(2000)
             else:
                 print("Good Action screen not visible.")
        except Exception as e:
             print(f"Interaction error: {e}")

        page.wait_for_timeout(3000) # Wait for animation/transition to Dashboard

        # === MAP VERIFICATION ===
        print("Looking for 'CAMINHO' tab...")
        # Use exact text match or better selector
        caminho_tab = page.locator("button").filter(has_text="CAMINHO").first

        if not caminho_tab.is_visible():
            print("ERROR: CAMINHO tab not found. Dumping page text:")
            # print(page.inner_text("body"))
            page.screenshot(path="verification/debug_error.png")
            browser.close()
            return

        print("Clicking 'CAMINHO' tab...")
        caminho_tab.click()
        page.wait_for_timeout(2000) # Wait for scroll

        # 2. Check for "Future" header (Safeguard)
        print("Checking for 'O Futuro Aguarda' header...")
        future_header = page.get_by_text("O Futuro Aguarda")
        if future_header.is_visible():
             print("SUCCESS: Future header is visible.")

        # 3. Check for Current Day (Day 1)
        print("Checking for Day 1...")
        day_one = page.get_by_text("1", exact=True)

        # Take screenshot 1: Initial Map Load
        print("Taking screenshot 1: map_initial_load.png")
        page.screenshot(path="verification/map_initial_load.png")

        # 4. Switch Tabs
        print("Switching to 'LAR'...")
        # Use specific selector to avoid conflict with title
        lar_tab = page.locator("button").filter(has_text="LAR").first
        lar_tab.click()
        page.wait_for_timeout(1500)

        print("Switching back to 'CAMINHO'...")
        caminho_tab.click()
        page.wait_for_timeout(2000) # Wait for auto-scroll fix

        # Take screenshot 2: After Tab Switch
        print("Taking screenshot 2: map_after_switch.png")
        page.screenshot(path="verification/map_after_switch.png")

        browser.close()

if __name__ == "__main__":
    verify_map_fix()
