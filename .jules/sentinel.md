# Sentinel's Journal - Critical Security Learnings Only

This journal contains entries for CRITICAL security learnings, such as specific vulnerability patterns in this codebase, unexpected side-effects of security fixes, or security architecture constraints.

## 2026-07-19 - Stored XSS via raw innerHTML interpolation in monolithic frontends
**Vulnerability:** Inserting user-defined fields (such as quest/habit titles, text log submissions, penalty trigger causes, and AI-generated verdicts) directly into the DOM using backtick string interpolation in `element.innerHTML` templates. Specifically, a user submitting a text log containing `</textarea><script>...</script>` would close the parent textarea tag and execute arbitrary scripts when rendering.
**Learning:** Monolithic vanilla JavaScript applications often rely heavily on string templates and `innerHTML` for rapid dynamic view-rendering. This pattern inherently bypasses the browser's native parser protections, leaving the application highly susceptible to stored/reflected XSS—even if the application runs entirely client-side and persists state to `localStorage` or imports/restores from backup files.
**Prevention:** Avoid setting raw, unescaped variables directly inside `innerHTML`. Create a lightweight `escapeHTML` utility to sanitize all dynamic user strings before they are rendered, or use safe DOM-manipulation properties (like `textContent` or `innerText`) for text insertion.

## 2026-08-02 - Client-Side Prototype Pollution via Unsafe Recursive Object Merging
**Vulnerability:** The application uses a custom recursive `deepMerge` function to combine a default state with a saved or imported state. Because this function lacked checks for sensitive prototype keys (`__proto__`, `constructor`, `prototype`), it was vulnerable to Client-Side Prototype Pollution. A user importing a maliciously crafted backup JSON could overwrite `Object.prototype` properties, potentially leading to arbitrary property injection or client-side Denial of Service/unexpected code behavior.
**Learning:** Object merging and cloning functions must explicitly shield prototype pollution paths. Native features (like `JSON.parse` or spreading) do not recursively merge deep paths, but custom traversal routines do.
**Prevention:** Explicitly ignore/skip keys named `__proto__`, `constructor`, and `prototype` in any recursive cloning, parsing, or merging logic to ensure the global prototype remains pristine.

## 2026-08-09 - Client-Side Import Deserialization & Structural Validation
**Vulnerability:** Unsanitized file uploads (JSON format) loaded directly into memory or local storage. In a static client-only PWA, importing backups can bypass UI validations, allowing attackers to load corrupted schemas, malicious string injections, or extreme out-of-bounds metrics (like level 999999 or huge strings), which causes denial of service via local storage quota exhaustion.
**Learning:** Even when custom functions like `deepMerge` are protected, direct object assignment from a parsed JSON object (e.g. `State = imported` or `APEX.playerState = imported.playerState`) bypasses protection if the object structure contains polluted prototype keys or malicious payloads.
**Prevention:** Run all parsed JSON backups through a strict schema validation and sanitization layer immediately after parsing. Strip prototype keys recursively using `sanitizeKeys()`, truncate all user-controlled string fields, and clamp numerical values (like player level and stats) to safe operational boundaries before state assignment.
