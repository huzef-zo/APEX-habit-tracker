from playwright.sync_api import sync_playwright

def run_cuj(page):
    print("Navigating to APEX...")
    page.goto("http://localhost:8080/index.html")
    page.wait_for_timeout(1000)

    # Perform onboarding
    print("Performing onboarding...")
    page.fill("#onboarding-name-input", "Sung Jin-Woo")
    page.wait_for_timeout(500)
    page.click("#onboarding-modal button")
    page.wait_for_timeout(1000)

    # Click FAB to open quest creation modal
    print("Opening Quest modal...")
    page.click("#fab")
    page.wait_for_timeout(500)

    # Click Sunday and Monday day buttons to toggle them
    print("Toggling Sunday and Monday day buttons...")
    page.click("button[aria-label='Sunday']")
    page.wait_for_timeout(500)
    page.click("button[aria-label='Monday']")
    page.wait_for_timeout(500)

    # Verify aria-pressed attributes
    sun_pressed = page.get_attribute("button[aria-label='Sunday']", "aria-pressed")
    mon_pressed = page.get_attribute("button[aria-label='Monday']", "aria-pressed")
    tue_pressed = page.get_attribute("button[aria-label='Tuesday']", "aria-pressed")
    print(f"Sunday aria-pressed: {sun_pressed}")
    print(f"Monday aria-pressed: {mon_pressed}")
    print(f"Tuesday aria-pressed: {tue_pressed}")

    # Take screenshot of the modal with toggled day buttons
    page.screenshot(path="verification/screenshots/day_buttons_aria.png")
    page.wait_for_timeout(1000)

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
