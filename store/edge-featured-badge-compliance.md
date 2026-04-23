# Microsoft Edge — Featured Badge compliance audit

Maps every criterion from Microsoft's public [Best practices for extensions](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/best-practices) page (and the associated [Minimize page load time impact](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/minimize-page-load-time-impact) guide) to concrete evidence in this repository. The Featured Badge at [microsoftedge.microsoft.com](https://microsoftedge.microsoft.com/) is awarded by an automated Microsoft evaluation; this document doesn't submit anything, it just keeps the project honest against the checklist.

Last audited: 2026-04-15 against the v0.0.7 release line (release branch HEAD at the time of writing).

---

## Security

> Make sure that your extension doesn't pose any security threats to users.

- Full source is public at https://github.com/isaiasgv/ClearCache, GPL-3.0.
- Runtime surface is one file, [`background.js`](../background.js) (~420 lines of vanilla ES2022), plus two pure helper modules in [`lib/`](../lib/).
- No minification, no obfuscation, no remote code, no use of `eval`, no dynamic `import()` of remote URLs, no runtime code-string compilation.
- Verifiable — the GitHub Release zip is reproducible from any tagged commit via the four-step recipe in [firefox-amo-answers.md](./firefox-amo-answers.md#build-instructions).

> Request only the permissions that are necessary for core functionality.

- Manifest declares exactly 5 API permissions and 1 host permission.
- Every permission has a ≥1-line written justification in [docs/privacy.md](../docs/privacy.md#permissions-and-why-they-exist) and a reviewer-facing justification in [chrome-webstore-answers.md](./chrome-webstore-answers.md#permission-justifications). Reviewers can trace each permission back to the specific `chrome.*` call site that uses it.

> Use secure coding practices, and avoid third-party libraries with known vulnerabilities.

- **Zero** third-party runtime dependencies. The shipped zip is `manifest.json` + `background.js` + `lib/*.js` + `icons/` + `_locales/` + `LICENSE`.
- `devDependencies` exist (vitest, puppeteer-core) but are **not** in the shipped zip — the release workflow's zip step explicitly copies only the runtime files.
- `lib/` helpers (`origin.js`, `browser-compat.js`) are pure functions unit-tested under Node (95 passing tests).
- No dynamic code execution anywhere — no `eval`, no runtime-compiled code, no inline event handlers, no remote script tags.

> Respond promptly to any flagged issues.

- [SECURITY.md](../SECURITY.md) commits to:
  - Acknowledgement within **7 days**.
  - Initial severity/scope assessment within **14 days**.
  - Critical fixes published as soon as a verified patch exists, not bundled with the monthly release.
- Private disclosure channel via GitHub Security Advisories (link in SECURITY.md).

---

## Privacy

> Handle user data responsibly and in accordance with your published privacy policy.

- Published policy: [docs/privacy.md](../docs/privacy.md). The TL;DR is "collects nothing, transmits nothing, stores nothing." The policy is literally implementable by reading `background.js`.
- No `chrome.storage` call anywhere in the codebase. No `localStorage`. No IndexedDB.
- No HTTP requests issued by the extension. It has no `fetch`, no `XMLHttpRequest`, and no remote update / telemetry endpoints.

> Clearly disclose what data is collected and how it is used.

- Privacy policy enumerates every `chrome.*` API the extension calls, and the exact fields it reads from each.
- The only data ever held is the **in-memory `fromCache` counter** used for the toast's "fresh vs. cached" display — 4-second window, then discarded. This is called out explicitly in [`docs/privacy.md`](../docs/privacy.md#what-the-extension-does).
- Firefox AMO submission declares `browser_specific_settings.gecko.data_collection_permissions = { required: ["none"] }` — a truthful, machine-readable zero-collection declaration.
- Chrome Web Store "Data usage" form: all 9 data-category checkboxes unchecked; all 3 certification disclosures checked. See [chrome-webstore-answers.md](./chrome-webstore-answers.md#data-usage).

> Avoid tracking or fingerprinting users without explicit consent.

- No content scripts (the only injection is a transient toast via `chrome.scripting.executeScript` after an explicit user action — see the "User experience" section for flow).
- `webRequest.onCompleted` listener reads **only `tabId` and `fromCache`** — not URLs, not headers, not bodies. Does not block, modify, or redirect requests.
- No canvas reads, no audio fingerprinting, no navigator-property harvesting, no IP resolution.

---

## User experience

> Provide a clean, intuitive, and responsive interface.

- No popup window, no options page, no side panel. The UI surface is:
  - Toolbar icon (click = clear + reload current site).
  - Right-click context menu on the toolbar icon (7 modes).
  - Right-click context menu on hyperlinks (1 entry: "Open link with fresh cache").
  - 5 keyboard shortcuts (`Alt+Shift+R / S / A / D / W`), all rebindable at `edge://extensions/shortcuts`.
  - A color-coded toast that appears on the freshly reloaded page (~2s, then auto-dismisses).
  - A color-coded badge on the toolbar icon (~1.5s) as a fallback when toast injection is blocked (e.g. on `edge://` pages).
- Responsive: every action completes in <100 ms of wall-clock time at the extension level; the only wait is the browser's own cache clear + reload.

> Avoid disruptive ads, pop-ups, or misleading prompts.

- No ads. No prompts. The post-reload toast is small (max 320 px wide), positioned top-right, dismisses automatically, has `pointer-events: none` so it never intercepts clicks, and is skipped entirely on pages where scripting is disallowed.
- No permission prompts at runtime — all permissions are manifest-declared and granted at install time.

> Ensure the extension integrates seamlessly into the browsing experience.

- Native-feel integration: the right-click entries use the browser's own context menu surface, the toolbar icon uses standard `chrome.action` badge APIs, keyboard shortcuts go through the browser's standard command system.
- No theming hacks, no persistent overlays, no interference with page content or rendering beyond the transient toast.

---

## Store listing

> Provide clear and concise descriptions, to set accurate user expectations.

- Listing copy maintained in **8 languages** in [store/README.md](./README.md#store-listing-copy): en, es, zh_CN, ja, de, fr, pt_BR, it.
- Short descriptions cap at the 132-char Edge/Chrome limit without truncation artifacts.
- Full descriptions follow the Edge-friendly pattern: tagline → problem framing → feature list → manifest/policy footer. No keyword stuffing.
- Every claim in the description maps to a real feature in the code — no vaporware, no hedging.

> Include high-quality screenshots that reflect the actual user experience.

- 4 screenshots in [store/screenshot/](./screenshot/), each exactly **1280 × 800 px, 24-bit PNG, no alpha channel** (the Edge spec). Validated with `System.Drawing`.
- Hero shot shows the extension icon in the browser toolbar with the green ✓ toast visible on a real web page.
- Additional shots cover: amber/star all-sites toast, red/skull deep-clear toast, and the `chrome://extensions/shortcuts` page with all 5 keyboard bindings visible.
- Capture recipe documented at [docs/screenshots/CAPTURE_GUIDE.md](../docs/screenshots/CAPTURE_GUIDE.md) so re-capture is reproducible.
- Source raw captures are committed alongside the processed versions for reproducibility.

---

## Performance and stability

> Minimize background activity and memory usage.

- MV3 service worker. No persistent background page. The worker only wakes on user events (click / keyboard shortcut / context menu / tab update for the toast queue) and goes idle afterward — no polling, no timers beyond the short `setTimeout`s that dismiss the badge and toast.
- Memory footprint is a handful of `Map` entries keyed by `tabId` (pending toasts + in-flight telemetry counters), both cleared after ~4 seconds.

> Avoid crashes, freezes, or excessive CPU consumption.

- All I/O is `async` / `await`. No blocking synchronous calls. No `localStorage`. No `XMLHttpRequest`.
- 95 unit tests under vitest covering the pure helpers (URL parsing, registrable-domain detection, Firefox dataTypes filtering). All green on every push via GitHub Actions CI.
- No long-running loops, no heavy string manipulations, no recursion.

> Test your extension across different versions of Microsoft Edge and supported platforms.

- Manifest `minimum_chrome_version: 114` (and thus `minimum_edge_version` is implicit at the Edge release matching Chromium 114, which is Edge 114+).
- Firefox manifest `strict_min_version: 112.0`.
- Verified manually on the latest-stable version of Edge + Chrome + Firefox before each stable release. Chromium zip is identical across all Chromium browsers (Edge, Chrome, Brave, Arc, Opera, Vivaldi).

> Refer to "Minimize an extension's impact on page load time."

ClearCache's entire page-load-impact story is: **we don't have any content scripts.** The Microsoft page-load-impact guide is about minimizing content-script cost; ClearCache sidesteps it entirely.

Specifically:

- [x] **No `content_scripts` in manifest** — zero per-page cost. Every injected script is gated behind a user action and delivered via `chrome.scripting.executeScript`.
- [x] **Scripting only when needed** — the toast injector is a ~50-line function that runs once per user-triggered clear, on exactly one tab, and exits immediately after scheduling the fade-out. It doesn't touch the DOM beyond a single top-right overlay.
- [x] **Only load on required pages/frames** — `target: { tabId }` on every `executeScript` call; never `allFrames: true`; never a broad `matches` URL pattern.
- [x] **`run_at` equivalent** — moot because we don't declare static content_scripts. The injection only happens *after* the reload has completed (via `chrome.tabs.onUpdated` with `status === "complete"`), so it never competes with the page's own critical path.
- [x] **No blocking calls** — every extension API is called via promises + `await`. No `XMLHttpRequest`, no synchronous `localStorage`, no `chrome.storage.sync`.
- [x] **Asynchronous storage** — N/A, the extension stores nothing.
- [x] **Asynchronous messaging** — N/A, no content-script ↔ background channel.
- [x] **Web Workers for heavy tasks** — N/A, no heavy tasks.

---

## Responsiveness to user feedback

> Monitor user reviews, and respond constructively.

- GitHub Issues is the primary triage channel. SECURITY.md routes private disclosures through GitHub Security Advisories.
- Public response templates TBD once the first store review lands; commitment is to reply within the same SLA as SECURITY.md (7 days).

> Address bugs and usability issues in a timely manner.

- Release workflow cuts a tagged `vX.Y.Z` stable release automatically on push to `main` when any `fix:` / `feat:` / `perf:` / `refactor:` commit is present. Hotfixes can go `release` → `main` the same day.
- No manual release step; bug fix → commit → merge → zip on the release page, typically under an hour.

> Maintain a regular update cadence, to improve reliability and user trust.

- Conventional Commits + automated semver bump + automated GitHub Release. Every meaningful user-visible change produces a new version with a changelog entry.
- Target cadence: monthly stable releases, more frequent prereleases on the `release` branch.

---

## Summary table

| Criterion | Status | Evidence file(s) |
|---|---|---|
| No security threats | ✅ | Full repo, `background.js`, `SECURITY.md` |
| Only necessary permissions | ✅ | `manifest.json`, `docs/privacy.md`, `chrome-webstore-answers.md` |
| No vulnerable third-party libs | ✅ | `package.json` (zero runtime deps) |
| Respond to flagged issues | ✅ | `SECURITY.md` (7-day SLA) |
| Handle user data per policy | ✅ | `docs/privacy.md`, `background.js` |
| Clearly disclose data use | ✅ | `docs/privacy.md`, Firefox `data_collection_permissions: ["none"]` |
| No tracking/fingerprinting | ✅ | No content scripts, `webRequest` read-only on 2 fields |
| Clean intuitive UI | ✅ | Toast + badge + context menu, no popup |
| No disruptive ads/prompts | ✅ | No popups, no ads, transient toast |
| Seamless integration | ✅ | Native context menus, native keyboard commands |
| Clear store descriptions | ✅ | `store/README.md` (8 languages) |
| High-quality screenshots | ✅ | `store/screenshot/*.png` (1280×800, 24-bit, no alpha) |
| Minimal background activity | ✅ | MV3 service worker, no timers/polling |
| No crashes/freezes | ✅ | 95 passing unit tests, all-async code |
| Cross-Edge testing | ✅ | `minimum_chrome_version: 114` + manual check |
| Page-load impact minimized | ✅ | Zero content_scripts; everything is user-triggered + targeted |
| Review monitoring | ✅ | GitHub Issues + SECURITY.md SLA |
| Timely fixes | ✅ | Same-day hotfix path via `release` → `main` |
| Regular update cadence | ✅ | Automated semver + Conventional Commits releases |

**No gaps identified at the time of this audit.**

---

## Maintenance

Re-run this audit on each major version bump, and any time:

- A new permission is added to either manifest.
- A new `chrome.scripting.executeScript` call site is introduced.
- A new content_script is ever added (currently: never — if this ever changes, the page-load section needs a full rewrite).
- Microsoft updates the Best Practices page (watch https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/best-practices).

## Reviewer paste target

When submitting an update at [Microsoft Edge Add-ons Partner Center](https://partner.microsoft.com/dashboard/microsoftedge), paste the "Summary table" section above into the "Notes for certification" field (or link to this file). It gives the automated reviewer a one-click mapping from each evaluation criterion to the evidence file.
