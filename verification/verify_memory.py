
from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        print('Navigating to app to seed storage...')
        page.goto('http://localhost:4173')

        # Inject Coins
        page.evaluate(f'''() => {{
            localStorage.setItem('checkin_coins', '1000');
        }}''')

        print('Reloading...')
        page.reload()
        page.wait_for_timeout(2000)

        # 3. Lar Screen & Game Hub
        print('Clicking Lar...')
        page.locator('button').filter(has_text='LAR').click()
        page.wait_for_timeout(1000)

        print('Clicking Brincar...')
        page.get_by_text('BRINCAR').click()
        page.wait_for_timeout(2000)

        # 4. Open Memory Game
        print('Opening Memory Game...')
        # Look for the button with 'Memória Bíblica' text
        page.get_by_text('Memória Bíblica').click()
        page.wait_for_timeout(2000)

        # Check if overlay is visible and game content loaded
        # The game renders buttons with emojis
        # We check for the header or close button to ensure it didn't crash
        if page.locator('div.grid.grid-cols-4').count() > 0:
             print('Memory Game Grid found!')
        else:
             print('ERROR: Memory Game Grid NOT found!')

        page.screenshot(path='verification/4_memory_game.png')
        print('Memory Game screenshot taken')

        browser.close()

if __name__ == '__main__':
    run()
