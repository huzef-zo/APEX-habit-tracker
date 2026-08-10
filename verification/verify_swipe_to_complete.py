from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

    print("Navigating to APEX...")
    page.goto("http://localhost:8080/index.html")
    page.wait_for_timeout(3500) # wait for intro animation to finish

    # Check and perform Player Onboarding
    print("Performing onboarding...")
    onboarding_input = page.locator("#onboarding-name-input")
    onboarding_input.fill("Sung Jin-Woo")
    page.wait_for_timeout(500)

    # Click Initialize button
    page.click("#onboarding-modal button")
    page.wait_for_timeout(1500)

    # Click FAB button
    print("Clicking FAB...")
    page.click("#fab")
    page.wait_for_timeout(500)

    # Fill in new quest details
    print("Filling quest...")
    page.fill("#habit-name", "Daily Shadow Monarch Slaying")
    page.wait_for_timeout(500)

    # Select Hard Difficulty
    page.select_option("#habit-diff", "hard")
    page.wait_for_timeout(500)

    # Select every day repeating
    page.click("button:has-text('Select Every Day')")
    page.wait_for_timeout(500)

    # Take screenshot of open modal
    page.screenshot(path="verification/screenshots/modal_filled.png")

    # Click Initialize Quest (Save)
    print("Clicking Initialize Quest save button...")
    page.click("#modal-save-btn")
    page.wait_for_timeout(1500)

    # Take screenshot of dashboard after save
    page.screenshot(path="verification/screenshots/after_save.png")

    # Check the Honesty Oath radio button
    print("Checking Honesty Oath...")
    page.check(".honesty-radio")
    page.wait_for_timeout(1000)

    page.screenshot(path="verification/screenshots/unlocked_slider.png")

    print("Swiping slider...")
    page.evaluate("""() => {
        const slider = document.querySelector('.swipe-slider');
        if (slider) {
            slider.value = 100;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            slider.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }""")
    page.wait_for_timeout(1500)

    page.screenshot(path="verification/screenshots/completed_quest.png")

    # Acknowledge level-up if modal is visible
    print("Acknowledging level-up...")
    if page.is_visible("#level-modal"):
        page.click("#level-modal button")
        page.wait_for_timeout(1000)

    page.screenshot(path="verification/screenshots/verification.png")

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
