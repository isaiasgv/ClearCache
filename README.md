<div align="center">

<img src="icons/icon128.png" alt="ClearCache logo" width="128" height="128" />

# Clear Cache & Hard Reload

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![CI](https://github.com/isaiasgv/ClearCache/actions/workflows/ci.yml/badge.svg)](https://github.com/isaiasgv/ClearCache/actions/workflows/ci.yml)
[![Release](https://github.com/isaiasgv/ClearCache/actions/workflows/release.yml/badge.svg)](https://github.com/isaiasgv/ClearCache/actions/workflows/release.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

</div>

A minimal, zero-dependency browser extension that clears the browser cache and performs a hard reload — scoped to the current site by default, with keyboard shortcuts and a right-click menu for broader wipes when you need them.

No popups. No options page. No telemetry. Just one button (and a few sensible escape hatches).

## Features

- **Per-site cache clear by default** — clicking the toolbar icon clears cache, Cache Storage, and Service Workers for the **current site only**, then hard-reloads. Other sites' cached data is left alone.
- **Three escalation modes** via keyboard shortcuts or the right-click menu:
  - Clear current site (default — `Alt+Shift+R` or click)
  - Clear **all sites** — `Alt+Shift+A`
  - Deep clear current site (cache + cookies + localStorage + IndexedDB) — `Alt+Shift+D`
- **Reload all tabs in the current window** — `Alt+Shift+W`. Clears the current tab's site cache, then hard-reloads every tab in the window. Useful when an app is open across several tabs.
- **Visual confirmation** — a 1.5-second color-coded badge on the toolbar icon after each action (✓ green / ★ amber / ☠ red).
- **Internationalized** — all UI strings live in `_locales/`. Adding a new language is a drop-in `_locales/<lang>/messages.json`.
- **Manifest V3** — modern service-worker architecture.
- **Tiny footprint** — single service worker, no third-party libraries, no remote calls, no tracking.

## Screenshots

> Screenshots will be added after the first store-ready build. Placeholders for now — see [docs/screenshots/README.md](docs/screenshots/README.md) for the capture spec.

| Toolbar icon | Badge confirmation | Right-click menu |
| ------------ | ------------------ | ---------------- |
| ![Toolbar icon](docs/screenshots/toolbar-icon.png) | ![Badge confirmation](docs/screenshots/badge-confirmation.png) | ![Context menu](docs/screenshots/context-menu.png) |

## Install

### From source (developer mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/isaiasgv/ClearCache.git
   ```
2. Open your Chromium-based browser (Chrome, Edge, Brave, Arc, Opera) and navigate to the extensions page:
   - Chrome / Brave / Arc: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the cloned `ClearCache` folder.
5. Pin the extension to the toolbar for quick access.

## Usage

### Default: click the toolbar icon

Clears cache, Cache Storage, and Service Workers **for the current site only**, then hard-reloads. The badge flashes green ✓ on success.

### Other modes

| Action                                              | Keyboard          | Where else                                |
| --------------------------------------------------- | ----------------- | ----------------------------------------- |
| Clear current site & reload                         | `Alt+Shift+R`     | Toolbar click, right-click menu           |
| Clear **all sites** & reload current tab            | `Alt+Shift+A`     | Right-click menu                          |
| Deep clear current site (cache+cookies+storage)     | `Alt+Shift+D`     | Right-click menu                          |
| Reload all tabs in this window (clears current site)| `Alt+Shift+W`     | Right-click menu                          |

Rebind any shortcut at `chrome://extensions/shortcuts`.

### Badge colors

- ✓ green — current-site clear succeeded
- ★ amber — all-sites clear succeeded
- ☠ red — deep clear succeeded
- ! red — clear failed (check the service worker console for `[ClearCache]` errors)

## Permissions

| Permission         | Why it's needed                                                       |
| ------------------ | --------------------------------------------------------------------- |
| `browsingData`     | To clear cache, Cache Storage, Service Workers, and (in deep mode) cookies / localStorage / IndexedDB. |
| `tabs`             | To read the active tab's URL (for per-site scoping) and reload it.    |
| `contextMenus`     | To add the right-click menu entries on the toolbar icon.              |
| `<all_urls>`       | Required so the per-site scoping logic can resolve any origin you're on. The extension never reads page contents. |

The extension does **not** read page contents, track usage, or send data anywhere. See [docs/privacy.md](docs/privacy.md) for the full privacy policy.

## Browser compatibility

Tested on:

- Google Chrome 114+ (latest recommended)
- Microsoft Edge 114+
- Brave, Arc, Opera (Chromium-based, latest)

`minimum_chrome_version` is `114` because per-origin scoping in `chrome.browsingData.remove` requires it. Firefox is not supported (the `browsingData` API surface differs).

## Project layout

```
ClearCache/
├── background.js              # Service worker (~100 lines, handles all modes)
├── manifest.json              # Manifest V3 declaration
├── icons/                     # Toolbar icons (16, 32, 48, 128 px)
├── _locales/en/messages.json  # i18n strings (add more locales here)
├── LICENSE                    # GPL-3.0
├── README.md
├── CHANGELOG.md               # Auto-maintained by the release workflow
├── CONTRIBUTING.md
├── SECURITY.md
├── docs/
│   ├── privacy.md             # Privacy policy
│   └── screenshots/           # README-embedded screenshots
└── store/                     # Listing assets for Chrome Web Store / Edge
```

## Branching & releases

This project uses a two-branch model with **fully automated semver versioning** driven by [Conventional Commits](https://www.conventionalcommits.org/).

### Branches

| Branch    | Purpose                                                                |
| --------- | ---------------------------------------------------------------------- |
| `release` | Active development. All feature/fix PRs target this branch.            |
| `main`    | Stable. Mirrors what's published to the Chrome Web Store / Edge Add-ons. Updated monthly via PR from `release`. |

### Release cadence

- **Monthly:** open a PR `release` → `main`, review the rolled-up changes, merge.
- **Hotfix:** PR direct to `main` with a `fix:` commit. Patch release goes out immediately.

### What happens on merge to `main`

The [Release workflow](.github/workflows/release.yml) runs and:

1. Parses every commit since the last `v*` tag.
2. Determines the bump from the commit prefixes:
   - `feat!:`, `fix!:`, or `BREAKING CHANGE:` in body → **major**
   - `feat:` → **minor**
   - `fix:`, `perf:`, `refactor:` → **patch**
   - Only `chore:`/`docs:`/`test:`/`ci:`/`build:`/`style:` → **no release** (workflow exits cleanly)
3. Bumps `manifest.json` `"version"`, commits the bump as `chore(release): vX.Y.Z [skip ci]`, and pushes.
4. Creates and pushes the `vX.Y.Z` tag.
5. Builds `clearcache-X.Y.Z.zip` (the upload artifact for both stores).
6. Publishes a GitHub Release with auto-generated changelog, SHA-256 checksum, and the zip attached.

You can also run the workflow manually from the Actions tab with a `bump_override` (`major`/`minor`/`patch`) when you need a specific version.

### Store submission (manual)

After the GitHub Release appears, download the zip and upload it to:

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Microsoft Edge Add-ons Partner Center](https://partner.microsoft.com/dashboard/microsoftedge)

Store submission stays manual on purpose — both stores require a human to confirm the listing copy and permission justifications on every update.

### Branch protection (recommended)

Once you enable branch protection on `main`, the `github-actions[bot]` needs an exception to push the bump commit. Either:

- Allow `github-actions[bot]` to bypass branch protection rules, **or**
- Generate a fine-grained PAT with `contents: write` on this repo, store it as a repo secret named `RELEASE_TOKEN`. The workflow picks it up automatically.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

A few non-negotiables:

- **Do not include AI-assistant attribution** (Claude, Copilot, ChatGPT, etc.) in commit messages, commit trailers, author/committer fields, or PR descriptions. See [CLAUDE.md](CLAUDE.md) for the full rule.
- Keep the extension dependency-free and the permission set minimal.

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for the full text.

```
ClearCache — a one-click cache-clear and hard-reload browser extension.
Copyright (C) 2026  Isaias Garcia

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```
