# Changelog


## v0.0.8 — 2026-04-23

### Features
- feat: add 18 new locales, bringing UI coverage to 20 languages
- feat: add Alt+Shift+S "clear this site + open subdomains" mode
- feat: add "Open link with fresh cache" right-click menu on hyperlinks

### Fixes
- fix: satisfy AMO validation (data_collection_permissions, min Firefox 112)
- fix: strip Firefox-unsupported browsingData types

### Install

Two artifacts are published with every release:

- `clearcache-0.0.8.zip` — Chrome, Edge, Brave, Arc, Opera, Vivaldi (any Chromium MV3 browser).
- `clearcache-firefox-0.0.8.zip` — Firefox 112+.

Chromium: open `chrome://extensions`, enable Developer mode, click "Load unpacked", select the extracted folder.

Firefox: open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select any file inside the extracted folder. Temporary installs are removed on browser restart — use the signed AMO build for permanent install.

Or wait for the Chrome Web Store / Edge Add-ons / Firefox Add-ons listing to update.

**SHA-256:**

```
324f702a46a8975e4e547dbb99a79c2fb906a502d44f0a61b905c83c544c92ce         clearcache-0.0.8.zip
df816d6812810d762879ac69e40e87ac1230190411754e368f007f48b7c7d3e2  clearcache-firefox-0.0.8.zip
```

**Full changelog:** https://github.com/isaiasgv/ClearCache/compare/v0.0.7...v0.0.8


## v0.0.7 — 2026-04-15

### Install

Two artifacts are published with every release:

- `clearcache-0.0.7.zip` — Chrome, Edge, Brave, Arc, Opera, Vivaldi (any Chromium MV3 browser).
- `clearcache-firefox-0.0.7.zip` — Firefox 109+.

Chromium: open `chrome://extensions`, enable Developer mode, click "Load unpacked", select the extracted folder.

Firefox: open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select any file inside the extracted folder. Temporary installs are removed on browser restart — use the signed AMO build for permanent install.

Or wait for the Chrome Web Store / Edge Add-ons / Firefox Add-ons listing to update.

**SHA-256:**

```
a8925242da93af2500bb3e0dd2dc0bbf7963d4de66c88ae6311a1255472f8a45         clearcache-0.0.7.zip
6e862e89ee7be53d65a6d45747f2c79c75ba8f382e8d13394a409d3dcc3df983  clearcache-firefox-0.0.7.zip
```

**Full changelog:** https://github.com/isaiasgv/ClearCache/compare/v0.0.6...v0.0.7


## v0.0.6 — 2026-04-15

### Fixes
- fix: ship Firefox build as a release artifact

### Install

Two artifacts are published with every release:

- `clearcache-0.0.6.zip` — Chrome, Edge, Brave, Arc, Opera, Vivaldi (any Chromium MV3 browser).
- `clearcache-firefox-0.0.6.zip` — Firefox 109+.

Chromium: open `chrome://extensions`, enable Developer mode, click "Load unpacked", select the extracted folder.

Firefox: open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select any file inside the extracted folder. Temporary installs are removed on browser restart — use the signed AMO build for permanent install.

Or wait for the Chrome Web Store / Edge Add-ons / Firefox Add-ons listing to update.

**SHA-256:**

```
1d1876448d872b8147c89ad045c10634697f4442cb8f5c1adb4e6c7b11c61e3d         clearcache-0.0.6.zip
eced215997680ca545f05b03c0a2696a33cc5f315ae00802f7c32bc91f31c8a9  clearcache-firefox-0.0.6.zip
```

**Full changelog:** https://github.com/isaiasgv/ClearCache/compare/v0.0.5...v0.0.6


## v0.0.5 — 2026-04-15

### Features
- feat: add Firefox MV3 support

### Install

Download `clearcache-0.0.5.zip` below and load it as an unpacked extension.
 Or wait for the Chrome Web Store / Edge Add-ons listing to update.

**SHA-256:**

```
356832f3c8922a50dd1619c5b740e99254d1d52d12dd9e408987942ed66499fc
```

**Full changelog:** https://github.com/isaiasgv/ClearCache/compare/v0.0.4...v0.0.5


## v0.0.4 — 2026-04-15

### Features
- feat: generate 64x64 extension logo for Opera listing

### Install

Download `clearcache-0.0.4.zip` below and load it as an unpacked extension.
 Or wait for the Chrome Web Store / Edge Add-ons listing to update.

**SHA-256:**

```
62dde4da56b133a46d32b0e7e15371dc3dccbf68984e11c4857a814a3f12165d
```

**Full changelog:** https://github.com/isaiasgv/ClearCache/compare/v0.0.3...v0.0.4


## v0.0.3 — 2026-04-15

### Features
- feat: generate 300x188 Opera promo tile

### Install

Download `clearcache-0.0.3.zip` below and load it as an unpacked extension.
 Or wait for the Chrome Web Store / Edge Add-ons listing to update.

**SHA-256:**

```
9ccfd86bedf8003462fb4c66a8df20a84200ad475b3a5bde2f024970aa80187b
```

**Full changelog:** https://github.com/isaiasgv/ClearCache/compare/v0.0.2...v0.0.3


## v0.0.2 — 2026-04-13

### Fixes
- fix: render store and icon PNGs correctly at all sizes

### Install

Download `clearcache-0.0.2.zip` below and load it as an unpacked extension.
 Or wait for the Chrome Web Store / Edge Add-ons listing to update.

**SHA-256:**

```
257ce02bd490c008534ff53390c4d0f19e3c468b78274b75c3d5074108302bba
```

**Full changelog:** https://github.com/isaiasgv/ClearCache/compare/v0.0.1...v0.0.2


## v0.0.1 — 2026-04-13

### Breaking changes
- ci: default to patch bumps; require explicit signal for minor/major

### Features
- feat: add reload-all-windows command and reopen-in-incognito menu entry
- feat: add cache hit/miss telemetry to the post-reload toast
- feat: add Spanish (es) locale
- feat: add in-page toast confirmation after each clear
- feat: extract user-facing strings to _locales for i18n
- feat: add reload-all-tabs-in-window action
- feat: add right-click context menu with all clear modes
- feat: add keyboard shortcuts for all clear modes
- feat: add badge confirmation after each clear
- feat: scope cache clear to current site by default

### Install

Download `clearcache-0.0.1.zip` below and load it as an unpacked extension.
 Or wait for the Chrome Web Store / Edge Add-ons listing to update.

**SHA-256:**

```
a3eb0f27ca93c29cb4601e86e5de2a7f829aca470de4c97b401f197a9b548c7c
```

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and versions follow [Semantic Versioning](https://semver.org/),
driven by [Conventional Commits](https://www.conventionalcommits.org/).

