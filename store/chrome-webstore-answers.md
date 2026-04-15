# Chrome Web Store — Submission Answers

Canonical answers for the Chrome Web Store "Privacy practices" form. Reuse verbatim for Edge Add-ons and Opera Add-ons (same questions). Each field caps at 1,000 characters; counts below each answer.

---

## Single purpose description

> ClearCache clears the HTTP cache, Cache Storage, and Service Workers for the current website and hard-reloads the tab, so developers and users can verify that they are seeing the latest version of a site. Optional escalation modes clear cookies and storage for the current site, wipe every site's cache, or reload every tab in the window.

**Length:** ~420 chars (limit 1,000)

---

## Permission justifications

### `browsingData`

> Required to call `chrome.browsingData.remove()`, which is the entire point of the extension. It clears the HTTP cache, Cache Storage, and Service Workers for the current site (default mode) and additionally cookies, localStorage, and IndexedDB when the user explicitly invokes the deep-clear mode. Without this permission the extension cannot perform its single purpose.

**Length:** ~390 chars

### `tabs`

> Required to read the URL of the active tab so the cache clear can be scoped to that site's origin only, and to call `chrome.tabs.reload(tabId, { bypassCache: true })` after the clear so the user immediately sees fresh content. The extension reads only `tab.url` and `tab.id`; it does not read, modify, or inject anything into the tab content.

**Length:** ~345 chars

### `contextMenus`

> Required to register the right-click menu entries on the toolbar icon, giving users access to all escalation modes (clear current site, clear all sites, deep clear, reload all tabs in window, reload all tabs in all windows, reopen URL in incognito) without needing a popup UI or options page. The context menu is the primary alternative to keyboard shortcuts for users who prefer mouse-driven access.

**Length:** ~405 chars

### `scripting`

> Required to inject a small confirmation toast into the freshly reloaded page via `chrome.scripting.executeScript` with a function reference (not remote code). The toast appears in the top-right corner for ~2 seconds, confirms which mode ran, and shows cache hit/miss telemetry from the reload. Toast injection is the only use of this permission. The extension never reads page contents or executes arbitrary code on user pages.

**Length:** ~430 chars

### `webRequest`

> Required for read-only observation of subresource requests for a ~4-second window immediately after a cache-clear reload, so the confirmation toast can show "X fresh, Y cached" telemetry and let the user verify the wipe actually worked. The extension uses only `webRequest.onCompleted` and reads only the `tabId` and `fromCache` boolean. It never blocks, modifies, or redirects requests, and never inspects URLs, headers, or bodies.

**Length:** ~440 chars

### Host permission (`<all_urls>`)

> Required so the per-site scoping of `chrome.browsingData.remove({ origins: [origin] })` and the post-reload toast injection can work on any website the user visits. The extension does not read, modify, or transmit page contents, cookies, or any site data. It only (1) resolves the active tab's origin to scope the clear, (2) clears cache for that origin, and (3) injects a short-lived confirmation toast after reload. The broad host match is the minimum needed to support cache clearing on any site — narrower patterns would exclude sites the user visits.

**Length:** ~555 chars

---

## Remote code

**Answer: No, I am not using remote code.**

> Rationale (NOT submitted — for your reference):
> The entire extension is bundled in the zip. There are no `<script>` tags loading external files, no dynamic `import()` of remote URLs, no `eval()`, and no remote module references. The `chrome.scripting.executeScript({ func: renderToast, ... })` call passes a function defined inside `background.js` — it is serialized from the local bundle, not fetched remotely. Per Chrome's definition (external JS/Wasm not in the package), ClearCache does not use remote code.

---

## Data usage

### What user data do you plan to collect?

**Uncheck ALL nine boxes:**
- [ ] Personally identifiable information
- [ ] Health information
- [ ] Financial and payment information
- [ ] Authentication information
- [ ] Personal communications
- [ ] Location
- [ ] Web history
- [ ] User activity
- [ ] Website content

Rationale: the extension collects, stores, and transmits **nothing**. It only clears data — the opposite of collecting it. The `webRequest` listener reads `fromCache` booleans in memory for ~4 seconds to compute a telemetry counter shown in the toast, then discards them. No storage, no transmission, no logging.

### Three certification disclosures — check ALL THREE

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

---

## Privacy policy URL

Use either:

- `https://github.com/isaiasgv/ClearCache/blob/main/docs/privacy.md` (raw GitHub URL — works immediately)
- The landing page's privacy section once deployed to Cloudflare Pages (e.g. `https://clearcache.yourdomain.com/#privacy`)

Hosted first-party URL is slightly preferred by reviewers.

---

## Notes for the reviewer (Certification notes)

See [store/README.md — Certification notes](./README.md#certification-notes-edge--chrome-reviewer-field) for the full text. Paste it into the "Notes for certification" textarea when submitting.

---

## Reuse for other stores

| Store | Same answers? | Notes |
|---|---|---|
| **Edge Add-ons** | Yes | Identical permission model; same justifications apply. |
| **Opera Add-ons** | Yes | Same Chromium manifest; reuse verbatim. |
| **Firefox Add-ons (AMO)** | Mostly | Swap `chrome.*` references for `browser.*` in justifications. AMO does NOT have a dedicated remote-code question but does ask about minified/obfuscated code (answer: neither). |

---

## Changelog

| Date | Change |
|---|---|
| 2026-04-15 | Initial draft for Chrome Web Store v0.0.2 submission. |
