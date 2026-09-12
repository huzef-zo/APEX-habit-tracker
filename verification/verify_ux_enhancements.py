from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

    print("Navigating to APEX...")
    page.goto("http://localhost:8080/index.html")
    page.wait_for_timeout(3500) # wait for intro animation

    # Perform onboarding
    print("Performing onboarding...")
    page.fill("#onboarding-name-input", "Sung Jin-Woo")
    page.wait_for_timeout(500)
    page.click("#onboarding-modal button")
    page.wait_for_timeout(1000)

    # Verify Empty State CTA on Dashboard
    print("Verifying Empty State CTA...")
    page.screenshot(path="verification/screenshots/empty_state.png")
    page.wait_for_timeout(500)

    # Click CTA button inside empty state
    print("Clicking empty state CTA button...")
    page.click("button:has-text('Initialize New Quest')")
    page.wait_for_timeout(1000)

    # Type quest title to test character counter
    print("Testing character counter...")
    page.fill("#habit-name", "Daily 100 Pushups & Running Routine")
    page.wait_for_timeout(500)
    page.screenshot(path="verification/screenshots/modal_char_count.png")

    # Select every day repeating
    page.click("button:has-text('Select Every Day')")
    page.wait_for_timeout(500)

    # Save quest
    print("Saving quest...")
    page.click("#modal-save-btn")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/quest_added.png")

    # Accept dialog on deletion
    page.on("dialog", lambda dialog: dialog.accept())

    # Click delete quest
    print("Deleting quest...")
    page.click(".delete-btn")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/after_delete.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="verification/videos")
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
