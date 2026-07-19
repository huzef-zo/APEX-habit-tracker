# Sentinel's Journal - Critical Security Learnings Only

This journal contains entries for CRITICAL security learnings, such as specific vulnerability patterns in this codebase, unexpected side-effects of security fixes, or security architecture constraints.

## 2026-07-19 - Stored XSS via raw innerHTML interpolation in monolithic frontends
**Vulnerability:** Inserting user-defined fields (such as quest/habit titles, text log submissions, penalty trigger causes, and AI-generated verdicts) directly into the DOM using backtick string interpolation in `element.innerHTML` templates. Specifically, a user submitting a text log containing `</textarea><script>...</script>` would close the parent textarea tag and execute arbitrary scripts when rendering.
**Learning:** Monolithic vanilla JavaScript applications often rely heavily on string templates and `innerHTML` for rapid dynamic view-rendering. This pattern inherently bypasses the browser's native parser protections, leaving the application highly susceptible to stored/reflected XSS—even if the application runs entirely client-side and persists state to `localStorage` or imports/restores from backup files.
**Prevention:** Avoid setting raw, unescaped variables directly inside `innerHTML`. Create a lightweight `escapeHTML` utility to sanitize all dynamic user strings before they are rendered, or use safe DOM-manipulation properties (like `textContent` or `innerText`) for text insertion.
