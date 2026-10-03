from playwright.sync_api import sync_playwright

def run_cuj(page):
    print("Navigating to APEX...")
    page.goto("http://localhost:8080/index.html")
    page.wait_for_timeout(1000)

    # Perform onboarding if modal is visible
    if page.locator("#onboarding-modal").is_visible():
        print("Performing onboarding...")
        page.fill("#onboarding-name-input", "Sung Jin-Woo")
        page.click("#onboarding-modal button")
        page.wait_for_timeout(500)

    # Trigger a system message
    print("Triggering system message...")
    page.evaluate("App.showSystemMessage('TEST TITLE', 'This is a test notification message.')")
    page.wait_for_timeout(300)

    notif = page.locator("#system-notification")
    is_active = notif.evaluate("el => el.classList.contains('active')")
    role_attr = notif.get_attribute("role")
    live_attr = notif.get_attribute("aria-live")

    print(f"Notification active: {is_active}")
    print(f"Role attribute: {role_attr}")
    print(f"Aria-live attribute: {live_attr}")

    assert is_active, "Notification should be active"
    assert role_attr == "status", "Role should be status"
    assert live_attr == "polite", "Aria-live should be polite"

    # Take screenshot of active notification
    page.screenshot(path="verification/screenshots/notification_active.png")

    # Click dismiss button
    print("Clicking dismiss button...")
    page.click("#system-notification button[aria-label='Dismiss system notification']")
    page.wait_for_timeout(500)

    is_active_after = notif.evaluate("el => el.classList.contains('active')")
    print(f"Notification active after dismiss: {is_active_after}")

    assert not is_active_after, "Notification should be hidden after dismiss"

    # Take screenshot after dismissal
    page.screenshot(path="verification/screenshots/notification_dismissed.png")

    # Trigger a system error
    print("Triggering system error...")
    page.evaluate("App.showSystemError('Test error message.')")
    page.wait_for_timeout(300)

    role_attr_err = notif.get_attribute("role")
    live_attr_err = notif.get_attribute("aria-live")
    print(f"Error Role attribute: {role_attr_err}")
    print(f"Error Aria-live attribute: {live_attr_err}")

    assert role_attr_err == "alert", "Error Role should be alert"
    assert live_attr_err == "assertive", "Error Aria-live should be assertive"

    print("All notification verification assertions passed successfully!")

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
