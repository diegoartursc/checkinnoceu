from playwright.sync_api import Page, expect, sync_playwright
import datetime

def verify_checkin_flow(page: Page):
    # 1. Arrange: Setup local storage for a fresh state
    # We want devotional complete (so we see CheckInScreen)
    # But day NOT completed (so we see the flow)
    # And lastCompletedDay = 0

    # We need to inject script to set localStorage
    today_str = datetime.date.today().strftime("%a %b %d %Y")

    page.goto("http://localhost:5173")

    page.evaluate(f"""() => {{
        localStorage.setItem('checkin_day', '0');
        localStorage.setItem('checkin_completed_days', '{{}}');
        localStorage.setItem('devotional_date', '{today_str}');
        localStorage.setItem('devotional_complete', 'true');
        // Clear anything else that might interfere
        localStorage.removeItem('checkin_read_stories');
    }}""")

    # Reload to apply storage
    page.reload()

    # 2. Act & Assert Flow

    # Verify we are on CheckInScreen or MainLayout
    # Wait for "Jornada do Dia 1" text.
    # Note: CheckInScreen is rendered in MainLayout.
    expect(page.get_by_text("Jornada")).to_be_visible()
    expect(page.get_by_text("do Dia 1")).to_be_visible()

    print("Step 0 verified.")

    # Click "Começar"
    page.get_by_role("button", name="Começar").click()

    # Step 1: Message
    expect(page.get_by_text("Mensagem")).to_be_visible()
    print("Step 1 (Message) verified.")

    # Click "Próximo"
    # This should now go directly to Quiz (Step 2), skipping Game
    page.get_by_role("button", name="Próximo").click()

    # Step 2: Desafio (Quiz)
    expect(page.get_by_text("Desafio")).to_be_visible()

    # Verify NO Game elements
    # "Estoure o Medo" was the game title
    expect(page.get_by_text("Estoure o Medo")).not_to_be_visible()

    print("Step 2 (Quiz) verified. Game skipped.")

    # Take screenshot of the Quiz step
    page.screenshot(path="/home/jules/verification/checkin_quiz_step.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_checkin_flow(page)
        finally:
            browser.close()
