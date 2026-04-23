# Firefox Add-ons (AMO) — Submission Answers

Canonical answers for the [addons.mozilla.org Developer Hub](https://addons.mozilla.org/developers/) "Submit a New Add-on" form. Reuse verbatim on each new version upload.

---

## Basic info

| Field | Value |
|---|---|
| **Name** | `Clear Cache & Hard Reload` |
| **Add-on URL slug** | `clear-cache-hard-reload` |
| **Support email** | (your preferred public contact — pre-filled from account) |
| **Support website** | `https://github.com/isaiasgv/ClearCache/issues` |

---

## Summary

Plain text, max 250 chars. AMO shows this in catalog listings.

```
One-click per-site cache clear and hard-reload. Four keyboard modes, zero telemetry, open source under GPL-3.0.
```

**Length:** ~110 chars

---

## Description

Plain text, no HTML. AMO shows this on the detail page.

```
Ever updated a website but still see the old version? ClearCache fixes that in one click.

Click the toolbar icon and ClearCache wipes the cache for the site you are on and reloads the page, so you always see the latest version. Other sites are never touched.

A small confirmation appears in the top-right of the page so you know it worked, with a quick count showing how many files came back fresh vs. still cached.

Four modes, each with a keyboard shortcut and a right-click menu entry:

- Clear this site and reload — Alt+Shift+R (default click)
- Clear all sites and reload this tab — Alt+Shift+A
- Deep clear this site (cache, cookies, and storage) and reload — Alt+Shift+D
- Clear this site and reload every tab in this window — Alt+Shift+W

You can also right-click the toolbar icon to reopen the current page in a fresh private window after a deep clear.

Privacy: ClearCache collects nothing, sends nothing to any server, and stores nothing. It only clears data — the opposite of tracking. Every line of code is open source on GitHub.

Firefox note: due to Firefox API limitations, "cacheStorage" and Service Worker registrations cannot be wiped via browsingData. On sites that use Service Workers for offline caching, use deep-clear mode (Alt+Shift+D) which also removes cookies and storage to fully invalidate SW state.

Available in 20 languages including English, Spanish, French, German, Italian, Dutch, Polish, Portuguese (BR), Russian, Turkish, Japanese, Korean, Chinese (Simplified and Traditional), Vietnamese, Indonesian, Thai, Hebrew, Arabic, and Persian. Free and open source under GPL-3.0.
```

**Length:** ~1,360 chars

---

## Checkboxes

| Field | Value |
|---|---|
| This add-on is experimental | **Unchecked** — stable, production ready |
| Requires payment / non-free services / additional hardware | **Unchecked** — 100% free, no external dependencies |

---

## Categories (select up to 2)

- **Primary:** Web Development
- **Secondary:** Privacy & Security

Rationale: primary audience is web developers who need per-site cache invalidation during development. Secondary audience is users who want a one-click "log me out of this site and clear its traces" — that's the deep-clear use case.

Do NOT select "My add-on doesn't fit into any of the categories" — there are good fits.

---

## License

Select: **GNU General Public License v3.0**

Matches the `LICENSE` file in the repo. AMO records this alongside the upload; do not use "Custom" or "All Rights Reserved" since the source is GPL-3.0.

---

## Privacy Policy

- **This add-on has a Privacy Policy** → **Checked**

**URL:**
```
https://github.com/isaiasgv/ClearCache/blob/main/docs/privacy.md
```

If AMO asks for full text inline, paste the content of [docs/privacy.md](../docs/privacy.md).

---

## Notes to Reviewer

Paste into the "Notes to Reviewer" textarea when submitting. Reviewers see it; users do not.

```
No accounts, logins, or API keys needed. The extension works immediately after install.

Reproducing the build:

1. git clone https://github.com/isaiasgv/ClearCache.git
2. cd ClearCache
3. git checkout v0.0.8   (or whichever tag matches the uploaded zip)
4. The uploaded zip is built by the GitHub Actions release workflow. It copies manifest.firefox.json into the zip as manifest.json, plus background.js, LICENSE, icons/, _locales/, lib/. The full recipe is in .github/workflows/release.yml under the "Build extension zips" step.

Testing steps:

1. Load the zip as a Temporary Add-on via about:debugging#/runtime/this-firefox.
2. Pin the extension icon to the toolbar.
3. Navigate to any website (e.g. https://example.com).
4. Click the toolbar icon — the page reloads and a green toast appears in the top-right confirming the cache was cleared.
5. Right-click the toolbar icon to see all six modes.
6. Press Alt+Shift+R to test the keyboard shortcut (same as clicking the icon).
7. Press Alt+Shift+D on a site where you are logged in — cookies and storage are cleared, the page reloads, and you are logged out.

Permissions justification:
- browsingData: call browsingData.remove to clear cache, cookies, localStorage, IndexedDB.
- tabs: read the active tab URL for per-site scoping and reload it.
- contextMenus: right-click menu on the toolbar icon.
- scripting: inject the confirmation toast into the reloaded page. Uses scripting.executeScript with a function defined inside background.js — no remote code.
- webRequest: read-only observation of post-reload requests to compute a fresh-vs-cached counter for the toast. Only reads tabId and fromCache; never blocks, modifies, or inspects URLs / headers / bodies.
- <all_urls>: required for per-site scoping to work on any origin the user visits. The extension never reads page content.

Data collection: none. The manifest declares browser_specific_settings.gecko.data_collection_permissions.required = ["none"].

Source code: https://github.com/isaiasgv/ClearCache
```

---

## Per-version upload checklist

Before uploading each new `clearcache-firefox-X.Y.Z.zip`:

1. Verify `manifest.firefox.json` has:
   - `browser_specific_settings.gecko.id` = `clearcache@isaiasgv` (consistent across versions)
   - `browser_specific_settings.gecko.strict_min_version` = `112.0`
   - `browser_specific_settings.gecko.data_collection_permissions.required` = `["none"]`
2. Verify the version string matches both manifests (CI enforces this).
3. Update the `git checkout v0.0.X` line in the Reviewer Notes above to match the uploaded zip.
4. Upload only the zip — do NOT upload the Chromium zip to AMO.

---

## Differences from Chrome/Edge/Opera stores

| Difference | Firefox AMO | Chrome/Edge/Opera |
|---|---|---|
| Privacy practices form | No — single `data_collection_permissions` manifest key | Separate form with checkboxes for 9 data categories |
| Remote code question | No | Chrome asks explicitly |
| Minified/obfuscated code question | Yes (answer: neither) | Chrome/Edge implicit |
| Categories | 2 allowed | Chrome 1 primary, Edge similar |
| License field | Explicit dropdown | Chrome/Edge derive from uploaded files |
| Build reproduction | Required in Reviewer Notes | Encouraged in Certification Notes |

---

## Changelog

| Date | Change |
|---|---|
| 2026-04-15 | Initial draft for Firefox AMO v0.0.8 submission. |
