import os
from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8080/index.html")
    page.wait_for_timeout(500)

    # Make app container visible and complete onboarding
    page.evaluate('''() => {
        const app = document.getElementById('app-container');
        if (app) app.classList.add('visible');

        const intro = document.getElementById("intro-overlay");
        if (intro) intro.style.display = "none";

        const nameInput = document.getElementById("onboarding-name-input");
        if (nameInput) {
            nameInput.value = "Hunter";
            App.submitOnboarding();
        }

        const onboardingModal = document.getElementById("onboarding-modal");
        if (onboardingModal) onboardingModal.style.display = "none";

        const notification = document.querySelector(".system-notification");
        if (notification) notification.remove();

        APEX.addXp(100);
        const lvlModal = document.getElementById("level-modal");
        if (lvlModal) lvlModal.style.display = "none";

        APEX.allocateAttribute('str');
        App.navigate('dashboard');
    }''')
    page.wait_for_timeout(500)

    # Take screenshot
    page.screenshot(path="/home/jules/verification/screenshots/sync_ui.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
