
from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        print('Navigating to app to seed storage...')
        # Go to app first to set localstorage domain
        page.goto('http://localhost:4173')

        # Inject Coins and Energy
        # We need to know how UserContext stores data.
        # Based on previous reads: 'checkin_coins', 'checkin_pet'

        pet_state = {
            'type': 'ovelhinha',
            'name': 'Ovelhinha',
            'hunger': 100,
            'happiness': 100,
            'energy': 100, # Full energy
            'lastUpdate': 1700000000000
        }

        page.evaluate(f'''() => {{
            localStorage.setItem('checkin_coins', '1000');
            localStorage.setItem('checkin_pet', '{json.dumps(pet_state)}');
        }}''')

        print('Reloading to apply storage...')
        page.reload()
        page.wait_for_timeout(3000)

        # 1. CheckIn Screen
        page.screenshot(path='verification/1_checkin.png')
        print('CheckIn screenshot taken')

        # 2. Settings Screen
        print('Clicking Settings...')
        page.get_by_text('CONFIG').click()
        page.wait_for_timeout(1000)
        page.screenshot(path='verification/2_settings.png')
        print('Settings screenshot taken')

        # 3. Lar Screen & Game Hub
        print('Clicking Lar...')
        page.locator('button').filter(has_text='LAR').click()
        page.wait_for_timeout(1000)

        print('Clicking Brincar...')
        # Force click if needed, but it should be enabled now
        page.get_by_text('BRINCAR').click()
        page.wait_for_timeout(2000)

        page.screenshot(path='verification/3_games_hub.png')
        print('Games Hub screenshot taken')

        browser.close()

if __name__ == '__main__':
    run()
