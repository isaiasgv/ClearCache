# Clear Cache & Hard Reload

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![CI](https://github.com/isaiasgv/ClearCache/actions/workflows/ci.yml/badge.svg)](https://github.com/isaiasgv/ClearCache/actions/workflows/ci.yml)
[![Release](https://github.com/isaiasgv/ClearCache/actions/workflows/release.yml/badge.svg)](https://github.com/isaiasgv/ClearCache/actions/workflows/release.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

A minimal, zero-dependency browser extension that clears the browser cache and performs a hard reload of the active tab — all from a single toolbar click.

No popups. No options page. No telemetry. Just one button that does one thing well.

## Features

- **One-click cache wipe** — clears HTTP cache, Cache Storage, and Service Workers for all origins.
- **Hard reload** — reloads the active tab with `bypassCache: true` (equivalent to `Ctrl+Shift+R`).
- **Manifest V3** — built on the modern Chromium extension platform.
- **Tiny footprint** — a single service worker, no third-party libraries, no tracking.

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

Click the toolbar icon. That's it.

The extension will:
1. Clear cached HTTP responses, Cache Storage entries, and Service Worker registrations for every origin.
2. Hard-reload the currently active tab, bypassing whatever cache remains.

## Permissions

| Permission         | Why it's needed                                                       |
| ------------------ | --------------------------------------------------------------------- |
| `browsingData`     | To clear cache, Cache Storage, and Service Workers.                   |
| `tabs`             | To identify and reload the active tab.                                |
| `<all_urls>`       | The cache wipe applies to all origins — there is no per-site scope.   |

The extension does **not** read page contents, track usage, or send data anywhere.

## Browser compatibility

Tested on:

- Google Chrome (latest)
- Microsoft Edge (latest)
- Brave
- Arc

Any Chromium browser with Manifest V3 support should work. Firefox is not currently supported (the `browsingData` API surface differs).

## Project layout

```
ClearCache/
├── background.js     # Service worker — handles the toolbar click
├── manifest.json     # Manifest V3 declaration
├── icons/            # Toolbar icons (16, 32, 48, 128 px)
├── LICENSE           # GPL-3.0
└── README.md
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
