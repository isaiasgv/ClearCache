<p align="center">
  <img src="./icons/icon128.png" alt="ClearCache" width="128" height="128" />
</p>

<h1 align="center">Clear Cache &amp; Hard Reload</h1>

<p align="center">
  <em>One click. One site. One fresh load.</em>
</p>

<p align="center">
  <a href="https://www.gnu.org/licenses/gpl-3.0"><img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="License: GPL v3" /></a>
  <a href="https://developer.chrome.com/docs/extensions/mv3/intro/"><img src="https://img.shields.io/badge/Manifest-V3-green.svg" alt="Manifest V3" /></a>
  <a href="https://github.com/isaiasgv/ClearCache/actions/workflows/ci.yml"><img src="https://github.com/isaiasgv/ClearCache/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/isaiasgv/ClearCache/actions/workflows/release.yml"><img src="https://github.com/isaiasgv/ClearCache/actions/workflows/release.yml/badge.svg" alt="Release" /></a>
  <a href="https://github.com/isaiasgv/ClearCache/releases/latest"><img src="https://img.shields.io/github/v/release/isaiasgv/ClearCache?include_prereleases&sort=semver" alt="Latest release" /></a>
  <a href="#contributing"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" /></a>
</p>

---

A minimal, zero-dependency Chromium browser extension that **clears the cache for the current site and hard-reloads it** — in one click, with no settings to configure and no data leaving your browser.

When you need a bigger hammer, keyboard shortcuts and a right-click menu give you all-sites and deep-clear modes too.

> **No popups. No options page. No telemetry. No remote calls. ~100 lines of vanilla JS.**

## Why ClearCache?

The browser already gives you several cache-clearing tools — and each is annoying in its own way:

| Built-in option              | What it does                                            | Problem                                                                       |
| ---------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `Ctrl+Shift+R` (hard reload) | Reloads with `bypassCache: true` for *that* navigation  | Doesn't unregister Service Workers; subsequent navigations may still be stale |
| DevTools → Disable cache     | Bypasses cache *while DevTools is open*                 | You have to keep DevTools open. Doesn't help users testing your dev build.   |
| Settings → Clear browsing data | Wipes everything, with a confirmation dialog           | Nukes every site's cache. Multi-step. Loses your auth sessions everywhere.    |

**ClearCache fills the gap:** one click, scoped to the current site, with the Service Worker actually unregistered. The "all sites" and deep-clear modes are still there for when you really do want the big hammer — they just aren't the default.

## Install

> The Chrome Web Store and Edge Add-ons listings are not yet published. For now, install via side-load from a GitHub Release or build from source. Store badges will appear here once submissions are approved.

### Side-load from a GitHub Release (recommended)

1. Download the latest `clearcache-X.Y.Z.zip` from the [Releases page](https://github.com/isaiasgv/ClearCache/releases/latest).
2. Verify the SHA-256 against the `.sha256` file attached to the same release (optional but recommended).
3. Extract the zip somewhere stable (don't delete the folder — Chrome reads from it on every browser launch).
4. Open your browser's extensions page:
   - Chrome / Brave / Arc / Opera: `chrome://extensions`
   - Edge: `edge://extensions`
5. Toggle **Developer mode** on (top-right corner).
6. Click **Load unpacked** and select the extracted folder.
7. Pin the icon to your toolbar.

### Build from source

```bash
git clone https://github.com/isaiasgv/ClearCache.git
```

Then load the cloned folder via **Load unpacked** (steps 4–7 above). There is no build step.

## Usage

Click the toolbar icon. The current site's cache is cleared and the tab hard-reloads.

A toast appears in the top-right of the freshly loaded page confirming what got cleared. The toolbar icon also flashes a color-coded badge as a fallback (for chrome:// pages, the PDF viewer, and other surfaces where the extension can't inject the toast).

### All four modes

| Action                                           | Shortcut          | Right-click menu | Toast / badge color |
| ------------------------------------------------ | ----------------- | ---------------- | ------------------- |
| Clear current site &amp; reload **(default)**    | `Alt+Shift+R`     | ✓                | ✓ green             |
| Clear **all sites** &amp; reload current tab     | `Alt+Shift+A`     | ✓                | ★ amber             |
| Deep clear current site (cache + cookies + storage) | `Alt+Shift+D`  | ✓                | ☠ red               |
| Reload all tabs in this window (clears current site) | `Alt+Shift+W` | ✓                | ✓ green             |

Rebind any shortcut at `chrome://extensions/shortcuts`.

### Screenshots

> Screenshots will be added before the first store submission. Capture spec lives in [docs/screenshots/README.md](docs/screenshots/README.md).

| Toolbar icon | Toast confirmation | Right-click menu |
| ------------ | ------------------ | ---------------- |
| ![Toolbar icon](docs/screenshots/toolbar-icon.png) | ![Toast](docs/screenshots/badge-confirmation.png) | ![Context menu](docs/screenshots/context-menu.png) |

## Permissions

Every permission is justified. There are no "just in case" requests.

| Permission       | Why it's needed                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `browsingData`   | Calling `chrome.browsingData.remove` to clear cache, Cache Storage, Service Workers, and (deep mode only) cookies / localStorage / IndexedDB. |
| `tabs`           | Reading the active tab's URL to scope the clear to its origin, and reloading it.                                             |
| `contextMenus`   | Adding the right-click entries on the toolbar icon.                                                                          |
| `scripting`      | Injecting the confirmation toast into the freshly reloaded page. Toast injection is the *only* use of this permission.       |
| `<all_urls>`     | The per-site scoping logic must be able to resolve any origin you visit. The extension never reads page contents.            |

## Privacy

**The extension collects nothing, transmits nothing, and contacts no remote servers.** No analytics, no error reporting, no usage tracking. The full policy is at [docs/privacy.md](docs/privacy.md), and you can verify every claim by reading [`background.js`](background.js) — it's about 100 lines.

## Browser compatibility

| Browser                 | Status                                                       |
| ----------------------- | ------------------------------------------------------------ |
| Google Chrome 114+      | Supported (recommended)                                      |
| Microsoft Edge 114+     | Supported                                                    |
| Brave, Arc, Opera       | Supported (Chromium-based, latest)                           |
| Firefox                 | Not supported — `browsingData` API surface differs           |
| Safari                  | Not supported — different extension model                    |

`minimum_chrome_version` is `114` because the per-origin scoping in `chrome.browsingData.remove` requires it.

---

## For developers

### Project layout

```
ClearCache/
├── background.js              # Service worker — the entire runtime (~150 lines)
├── manifest.json              # Manifest V3 declaration
├── icons/                     # Toolbar icons (16, 32, 48, 128 px)
├── _locales/en/messages.json  # i18n strings (drop in _locales/<lang>/ to add a locale)
├── LICENSE                    # GPL-3.0
├── README.md
├── CHANGELOG.md               # Auto-maintained by the release workflow
├── CONTRIBUTING.md
├── SECURITY.md
├── CLAUDE.md                  # Hard rules for AI-assisted contributions
├── docs/
│   ├── privacy.md             # Privacy policy
│   └── screenshots/           # README-embedded screenshots
└── store/                     # Listing assets for Chrome Web Store / Edge Add-ons
```

### Branching model

| Branch    | Purpose                                                                       | Releases produced               |
| --------- | ----------------------------------------------------------------------------- | ------------------------------- |
| `release` | Active development. All feature/fix PRs target this branch.                   | **Prereleases** (`vX.Y.Z-rc.N`) |
| `main`    | Stable. Mirrors what's published to the stores. Updated monthly from `release`. | **Stable releases** (`vX.Y.Z`)  |

Push to `release` → automatic prerelease.
Merge `release` → `main` → automatic stable release.
Hotfix → PR direct to `main` with a `fix:` commit.

### Versioning policy

Versioning is fully automated by the [Release workflow](.github/workflows/release.yml) using [Conventional Commits](https://www.conventionalcommits.org/).

**Default: every releasable commit produces a patch.** This project deliberately stays in `0.x` and bumps minor/major only when explicitly stated.

| Commit type                                          | Triggers a release? | Default bump |
| ---------------------------------------------------- | ------------------- | ------------ |
| `feat:` / `fix:` / `perf:` / `refactor:` (with or without `!`) | yes       | **patch**    |
| `docs:` / `test:` / `chore:` / `ci:` / `build:` / `style:` / `revert:` | no | —          |

To request a higher bump, **state it explicitly** via either:

- A `Release-Bump:` trailer in any commit body in the release range:
  ```
  feat: rework the toast renderer

  Release-Bump: minor
  ```
- A manual workflow run with `bump_override = minor` or `major` from the Actions tab.

The highest level signaled across all commits in the range wins.

### Release workflow details

**On push to `release` (prerelease):**

1. Compute the next semver base from commits since the last stable tag.
2. Count existing `vX.Y.Z-rc.*` tags for that base, increment to get `rc.N`.
3. Set the manifest version *inside the zip only* to `X.Y.Z.N` (Chrome's 4-digit form — the closest legal encoding of `X.Y.Z-rc.N`). The repo's `manifest.json` is **not** modified.
4. Build `clearcache-X.Y.Z-rc.N.zip` + SHA-256.
5. Tag `vX.Y.Z-rc.N` and publish a GitHub Release marked **prerelease**.
6. `CHANGELOG.md` is **not** updated (only stable releases write to it).

**On push to `main` (stable):**

1. Same bump computation.
2. Set the manifest version to `X.Y.Z`, build the zip + SHA-256.
3. Prepend release notes to `CHANGELOG.md`.
4. Commit `manifest.json` + `CHANGELOG.md` together as `chore(release): vX.Y.Z [skip ci]`, push to `main`.
5. Tag `vX.Y.Z` and publish a GitHub Release.

**Branch protection:** once `main` is protected, allow `github-actions[bot]` to bypass, **or** create a fine-grained PAT with `contents: write` and store it as repo secret `RELEASE_TOKEN`. The workflow picks it up automatically.

### Store submission (manual)

After the GitHub Release for a stable `vX.Y.Z` appears, download the zip and upload it to:

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Microsoft Edge Add-ons Partner Center](https://partner.microsoft.com/dashboard/microsoftedge)

Submission stays manual on purpose — both stores require a human to confirm listing copy and permission justifications.

## Contributing

Contributions welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

Hard rules (also in [CLAUDE.md](CLAUDE.md)):

- **No AI-assistant attribution** in commits, trailers, author/committer fields, or PR descriptions.
- **No new dependencies, telemetry, or build steps.** This extension stays minimal.
- **Manifest V3 only.**
- **Don't manually edit `manifest.json`'s `version` field** — the release workflow owns it.

Reporting bugs → use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml).
Reporting security issues → see [SECURITY.md](SECURITY.md) (private disclosure via GitHub Security Advisories).

## License

GNU General Public License v3.0 — see [LICENSE](LICENSE).

```
ClearCache — a one-click cache-clear and hard-reload browser extension.
Copyright (C) 2026  Isaias Garcia

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```

---

<p align="center">
  Made with care, no analytics, and no AI co-authors.<br />
  <sub>Issues and PRs: <a href="https://github.com/isaiasgv/ClearCache/issues">github.com/isaiasgv/ClearCache</a></sub>
</p>
