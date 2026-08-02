## 2025-07-18 - Keyboard Activation on Custom Interactive Elements
**Learning:** Adding `role="button"` and `tabindex="0"` to standard interactive elements like `<span>` satisfies screen reader support but fails native keyboard activation (Enter/Space key presses). To ensure full accessibility without altering CSS styles, explicit `onkeydown` event handlers must be attached to manually trigger the click action when Enter or Space is pressed.
**Action:** Always include `onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"` alongside `role="button"` and `tabindex="0"` on non-native interactive components.

## 2025-07-25 - Custom Keyboard Focus Styling on Dark Sci-Fi Aesthetic
**Learning:** In dark sci-fi/gaming-themed designs with custom glow accents, developers often remove native browser outlines with `:focus { outline: none; }`, breaking keyboard navigation. Using `:focus-visible` with matching themed glowing outlines (e.g., custom border and box-shadow color matching `--primary`) keeps visual design pristine for mouse users while providing excellent, contextual visibility for keyboard navigators.
**Action:** Implement `:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; box-shadow: 0 0 10px var(--primary) !important; }` to restore high-contrast keyboard tracking without cluttering mouse click states.

## 2025-08-01 - Real-time Validation Feedback for Proof of Effort Textareas
**Learning:** When users must fulfill minimum length requirements (e.g., a 15-word minimum "Proof of Effort" to complete quests), forcing them to submit before receiving validation feedback introduces substantial friction and repetitive error states. Displaying a real-time, color-changing word counter below/above the text input dynamically transitions from a muted warning state to a clear success state, giving users immediate physical/visual confirmation that the criteria are met and elevating the overall RPG aesthetic.
**Action:** Always accompany text length validation inputs with dynamic, real-time counters that shift styles immediately upon fulfilling the requirement.
