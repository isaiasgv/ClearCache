# Privacy Policy

**Effective date:** 2026-04-13

## TL;DR

This extension collects nothing, transmits nothing, stores nothing about you, and contacts no remote servers. There is no analytics, no telemetry, no error reporting, no usage tracking, no ads, and no third parties.

## What the extension does

When you click the toolbar icon (or trigger a keyboard shortcut, or use the right-click context menu), the extension calls two browser APIs and nothing else:

- [`chrome.browsingData.remove`](https://developer.chrome.com/docs/extensions/reference/api/browsingData) — to clear cached HTTP responses, Cache Storage entries, Service Workers, and (in deep mode only) cookies / localStorage / IndexedDB. Scope is either the active tab's origin or all origins, depending on which mode you trigger.
- [`chrome.tabs.reload`](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-reload) — to hard-reload the active tab (or all tabs in the current window, in window mode).

Both calls execute entirely inside your browser. No data crosses the network.

## What the extension does NOT do

- It does **not** read the contents of pages you visit.
- It does **not** record your browsing history, click history, or shortcut usage.
- It does **not** store any data — no `chrome.storage`, no `localStorage`, no IndexedDB, no cookies created by the extension.
- It does **not** make HTTP requests.
- It does **not** include any analytics, error-reporting, crash-reporting, or telemetry SDK.
- It does **not** load remote code or remote configuration.
- It does **not** share, sell, or transmit any data to anyone.

## Permissions and why they exist

| Permission       | Used for                                                              |
| ---------------- | --------------------------------------------------------------------- |
| `browsingData`   | Calling `chrome.browsingData.remove` to clear cache and related data. |
| `tabs`           | Reading the active tab's URL (to scope clearing to its origin) and reloading it. The URL is read in-memory and never stored or transmitted. |
| `contextMenus`   | Adding right-click menu entries on the toolbar icon.                  |
| `<all_urls>`     | The cache wipe applies to every origin; there is no per-site scope on browser cache. |

## Children

The extension does not collect personal information from any user, including children under 13. It is not directed at any specific age group.

## Changes to this policy

If the extension's behavior ever changes in a way that affects this policy, the change will be:

1. Reflected in the source code (which is public).
2. Documented in [CHANGELOG.md](../CHANGELOG.md) under a `feat:` or `BREAKING CHANGE:` entry.
3. Published in a new version of this policy with an updated effective date.

## Contact

The source code lives at https://github.com/isaiasgv/ClearCache. To verify any of the claims above, read [background.js](../background.js) — it's about 100 lines.

For questions, open a [GitHub issue](https://github.com/isaiasgv/ClearCache/issues). For security concerns, see [SECURITY.md](../SECURITY.md).
