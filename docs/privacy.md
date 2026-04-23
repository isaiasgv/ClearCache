# Privacy Policy

**Effective date:** 2026-04-15

## TL;DR

This extension collects nothing, transmits nothing, stores nothing about you, and contacts no remote servers. There is no analytics, no telemetry sent anywhere, no error reporting, no usage tracking, no ads, and no third parties.

## What the extension does

When you click the toolbar icon (or trigger a keyboard shortcut, or use one of the right-click context menu entries), the extension calls a small set of browser APIs and nothing else:

- [`chrome.browsingData.remove`](https://developer.chrome.com/docs/extensions/reference/api/browsingData) — to clear cached HTTP responses, Cache Storage entries, Service Workers, and (in deep-clear mode only) cookies / localStorage / IndexedDB. Scope is either the active tab's origin, the active tab's origin plus all open subdomains, or every origin, depending on which mode you trigger.
- [`chrome.tabs.reload`](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-reload) — to hard-reload the active tab (or all matching tabs in the current window or all windows).
- [`chrome.tabs.create`](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-create) — only when you pick "Open link with fresh cache" on a hyperlink; opens that link in a new tab.
- [`chrome.windows.create`](https://developer.chrome.com/docs/extensions/reference/api/windows#method-create) — only when you pick "Deep clear & reopen in incognito"; opens a new incognito window at the current URL.
- [`chrome.scripting.executeScript`](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-executeScript) — to inject a short-lived confirmation toast into the reloaded page. The injected function is defined inside `background.js` (not fetched remotely) and only renders the toast; it does not read page contents.
- [`chrome.action.setBadgeText`](https://developer.chrome.com/docs/extensions/reference/api/action) — to flash a color-coded badge on the toolbar icon as confirmation.
- [`chrome.webRequest.onCompleted`](https://developer.chrome.com/docs/extensions/reference/api/webRequest) — read-only observation of subresource requests for roughly four seconds after a cache-clear reload, so the toast can show a "fresh vs. cached" counter. The extension only reads two fields per request: `tabId` and `fromCache` (a boolean). Counts are held in memory and discarded when the toast closes.

Every call above executes entirely inside your browser. No data crosses the network because of this extension.

## What the extension does NOT do

- It does **not** read the contents of pages you visit. The injected toast function only writes a small overlay; it does not query the DOM or access cookies, form data, storage, or credentials.
- It does **not** record your browsing history, click history, shortcut usage, or which sites you cleared cache for.
- It does **not** persist any data — no `chrome.storage`, no `localStorage`, no IndexedDB, no cookies created by the extension.
- It does **not** make HTTP requests. It does not fetch remote configuration, analytics endpoints, update checks, or anything else over the network.
- It does **not** include any analytics, error-reporting, crash-reporting, or telemetry SDK.
- It does **not** load remote code, eval strings, or dynamically import remote modules.
- It does **not** share, sell, or transmit any data to anyone.

## Permissions and why they exist

| Permission       | Used for                                                              |
| ---------------- | --------------------------------------------------------------------- |
| `browsingData`   | Calling `chrome.browsingData.remove` to clear cache, Cache Storage, Service Workers, and (deep mode only) cookies / localStorage / IndexedDB. |
| `tabs`           | Reading the active tab's URL (to scope clearing to its origin) and reloading it. Enumerating open tabs (to find sibling subdomains for the subdomain-clear mode). URLs are read in memory and never stored or transmitted. |
| `contextMenus`   | Adding right-click menu entries on the toolbar icon and on hyperlinks. |
| `scripting`      | Injecting the post-reload confirmation toast into the active page. The function is defined in `background.js`; no remote code. |
| `webRequest`     | Read-only observation of `tabId` + `fromCache` on subresource requests for ~4 seconds after a reload, to display a fresh-vs-cached counter in the toast. Never blocks, modifies, or records URLs / headers / bodies. |
| `<all_urls>` (host permission) | The per-site scoping of `browsingData.remove` and the toast injection need to work on any origin you visit. The extension never reads page contents. |

## Children

The extension does not collect personal information from any user, including children under 13. It is not directed at any specific age group and carries a general audience / 3+ rating on stores that require one.

## Changes to this policy

If the extension's behavior ever changes in a way that affects this policy, the change will be:

1. Reflected in the source code (which is public).
2. Documented in [CHANGELOG.md](../CHANGELOG.md) under a `feat:` or `BREAKING CHANGE:` entry.
3. Published in a new version of this policy with an updated effective date.

## Contact

The source code lives at https://github.com/isaiasgv/ClearCache. To verify any of the claims above, read [background.js](../background.js) — around 420 lines of vanilla JavaScript with no imports beyond two local pure-helper modules in `lib/`.

For questions, open a [GitHub issue](https://github.com/isaiasgv/ClearCache/issues). For security concerns, see [SECURITY.md](../SECURITY.md).
