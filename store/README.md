# Store assets

This folder holds promotional and listing assets for the Chrome Web Store and Microsoft Edge Add-ons. **None of these files are bundled into the extension zip** — the release workflow only packages `manifest.json`, `background.js`, `LICENSE`, `icons/`, and `_locales/`.

## Required asset checklist

| File                       | Dimensions | Format     | Used by         | Notes                                            |
| -------------------------- | ---------- | ---------- | --------------- | ------------------------------------------------ |
| `screenshot-01.png`        | 1280×800   | PNG        | Chrome, Edge    | Hero shot — toolbar icon pinned, in context.     |
| `screenshot-02.png`        | 1280×800   | PNG        | Chrome, Edge    | DevTools Network panel showing fresh load.       |
| `screenshot-03.png`        | 1280×800   | PNG        | Chrome, Edge    | Right-click context menu open on the toolbar.    |
| `promo-440x280.png`        | 440×280    | PNG / JPEG | Chrome (req'd)  | Small promo tile.                                |
| `promo-1400x560.png`       | 1400×560   | PNG / JPEG | Chrome (opt'l)  | Marquee — only matters if Google features you.   |
| `edge-logo-300.png`        | 300×300    | PNG        | Edge (req'd)    | Edge listing requires this in addition to 128×128. |

## Screenshot guidelines

Both stores reject screenshots that:

- Show **only the toolbar icon** with no context — pair the icon with whatever the user just did (DevTools, an open tab, etc.).
- Use **non-English text** in a listing localized to English.
- Contain **competitor branding** or trademarked logos.
- Have **misleading mockups** — the screenshot must show real extension behavior.

Recommended: keep a `~/.clearcache-store/` profile with the extension installed and a couple of known sites bookmarked, so you can reproduce identical screenshots when re-shooting for new versions.

## Listing copy

Reuse the description in [../README.md](../README.md). Both stores accept plain text (Chrome strips Markdown). Cap each paragraph at ~500 chars for readability in the listing's truncated preview.

## Privacy policy URL

Link to the raw GitHub URL for [docs/privacy.md](../docs/privacy.md), or host a rendered version on GitHub Pages. Both stores accept either.
