from playwright.sync_api import sync_playwright, expect
import time

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:3000")

        # Wait for intro to disappear
        print("Waiting for intro...")
        time.sleep(4)

        # Take initial dashboard screenshot
        page.screenshot(path="verification/dashboard.png")

        # Go to Status view
        print("Navigating to Status...")
        page.click("text=Status")
        time.sleep(0.5)
        page.screenshot(path="verification/status_empty.png")

        # Inject XP to level up
        print("Injecting XP and leveling up...")
        page.evaluate("""
            State.user.xp = State.user.xpToNext;
            App.checkLevelUp();
            saveState();
        """)
        time.sleep(1)

        # Acknowledge level up
        if page.is_visible("text=ACKNOWLEDGE"):
            page.click("text=ACKNOWLEDGE")

        time.sleep(1)
        page.screenshot(path="verification/status_with_points.png")

        # Allocate a point to STR
        print("Allocating point to STR...")
        page.click("xpath=//div[contains(., 'STRENGTH')]/following-sibling::div/button")
        time.sleep(0.5)
        page.screenshot(path="verification/status_after_allocation.png")

        # Open Add Quest modal
        print("Opening Add Quest modal...")
        page.click("#fab")
        time.sleep(0.5)
        page.screenshot(path="verification/add_quest_modal.png")

        # Add a quest
        print("Adding a quest...")
        page.fill("#habit-name", "Verification Quest")
        page.select_option("#habit-stat-cat", "str")
        # Select all days to be sure it shows up today
        page.evaluate("App.toggleEveryday()")

        page.click("text=Initialize Quest")
        time.sleep(0.5)

        # Verify quest exists on dashboard
        page.click("text=Dashboard")
        time.sleep(0.5)
        page.screenshot(path="verification/dashboard_with_quest.png")

        # Complete quest
        print("Completing quest...")
        page.click(".check-btn")
        time.sleep(1) # wait for notification
        page.screenshot(path="verification/quest_complete_notif.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
