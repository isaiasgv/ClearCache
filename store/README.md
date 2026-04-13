# Store assets

Promotional and listing assets for the Chrome Web Store and Microsoft Edge Add-ons.

**None of these files are bundled into the extension zip** — the release workflow only packages `manifest.json`, `background.js`, `LICENSE`, `icons/`, `_locales/`, and `lib/`.

## What's here

### Generated (promotional tiles + logo)

The HTML sources live in [`src/`](src/). Run the build script to render them to PNG at exact pixel dimensions:

```bash
node store/build-assets.mjs
```

The script auto-detects an installed Chrome, Edge, Brave, or Chromium and uses it in headless mode — no npm dependencies. Override with `CHROMIUM=/path/to/browser node store/build-assets.mjs`.

| Generated file                          | Dimensions | Used by          |
| --------------------------------------- | ---------- | ---------------- |
| `extension-logo-300x300.png`            | 300×300    | Edge Add-ons (required), Chrome Web Store (icon field) |
| `small-promo-tile-440x280.png`          | 440×280    | Chrome Web Store (required), Edge Add-ons (small promo tile) |
| `large-promo-tile-1400x560.png`         | 1400×560   | Chrome Web Store (marquee, optional — only if Google features the listing), Edge Add-ons (large promo tile, optional) |

Re-run the build any time you edit files under [`src/`](src/) or the logo in [`src/_logo.svg`](src/_logo.svg).

### Captured (screenshots)

Screenshots of the extension in action are **captured manually, not generated**, because the stores require them to represent real extension behavior. See [`docs/screenshots/CAPTURE_GUIDE.md`](../docs/screenshots/CAPTURE_GUIDE.md) for the exact shot list, dimensions (1280×800), and capture steps.

Store the captured PNGs in [`docs/screenshots/`](../docs/screenshots/) and copy them into this folder before uploading to the store dashboards.

## Upload order (applies to both stores)

1. `extension-logo-300x300.png` → Extension logo field
2. `small-promo-tile-440x280.png` → Small promotional tile field
3. `large-promo-tile-1400x560.png` → Large promotional tile field (optional)
4. Screenshots → Screenshots section (upload the hero shot first so it becomes the default thumbnail)

## Listing copy

Reuse the description in [../README.md](../README.md). Both stores accept plain text (Chrome strips Markdown). Cap each paragraph at ~500 chars for readability in the listing's truncated preview.

Suggested short description (under the 132-char cap):

> One-click per-site cache clear and hard-reload. Four keyboard modes, zero telemetry, open source.

## Privacy policy URL

Link to:

- The rendered landing page's privacy section once you've deployed the Cloudflare Pages site (e.g. `https://clearcache.yourdomain.com#privacy`), **or**
- The raw GitHub URL for [`docs/privacy.md`](../docs/privacy.md)

Both stores accept either. A hosted first-party URL is slightly preferred by reviewers.

## Do NOT commit these

The generated PNGs in this folder should **not** be committed — re-running the build any time is cheap and they'd bloat the repo. The `.gitignore` at the repo root excludes them. The HTML sources under [`src/`](src/) and the build script ARE committed.
