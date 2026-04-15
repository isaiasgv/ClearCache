# Store assets

Promotional and listing assets for the Chrome Web Store, Microsoft Edge Add-ons, and Opera Add-ons.

## Submission answer docs

Canonical, copy-pasteable answers for every store form are kept alongside this README. Reuse them verbatim on resubmission and for new stores.

| Store | Doc | Covers |
|---|---|---|
| Chrome Web Store | [chrome-webstore-answers.md](./chrome-webstore-answers.md) | Single purpose, permission justifications, remote code, data usage, privacy practices form |
| Microsoft Edge Add-ons | [edge-addons-answers.md](./edge-addons-answers.md) | Same form as Chrome plus Edge-specific listing fields (search terms, age rating) |
| Opera Add-ons | [opera-addons-answers.md](./opera-addons-answers.md) | General tab (URLs, build instructions, EULA, privacy policy) + Translations tab (en/es summary, description, changelog) |
| Firefox Add-ons (AMO) | [firefox-amo-answers.md](./firefox-amo-answers.md) | Name, summary, description, categories, license, privacy policy, and Reviewer Notes for the AMO Developer Hub submission form |

The **listing copy** (short description, full description, search terms — in both English and Spanish) lives further down in this README under [Store listing copy](#store-listing-copy). That copy is shared across all three stores.

---


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
| `extension-logo-64x64.png`              | 64×64      | Opera Add-ons (small icon), generic favicon-sized listing slots |
| `extension-logo-300x300.png`            | 300×300    | Edge Add-ons (required), Chrome Web Store (icon field) |
| `small-promo-tile-440x280.png`          | 440×280    | Chrome Web Store (required), Edge Add-ons (small promo tile) |
| `large-promo-tile-1400x560.png`         | 1400×560   | Chrome Web Store (marquee, optional — only if Google features the listing), Edge Add-ons (large promo tile, optional) |
| `opera-promo-tile-300x188.png`          | 300×188    | Opera Add-ons (optional promotional image — used if the site editors feature the extension) |

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

## Search terms

Edge allows up to 7 terms, 30 characters each, max 21 words total. Chrome Web Store doesn't have a search terms field — it indexes the description.

### English

| # | Term                    |
|---|-------------------------|
| 1 | clear cache             |
| 2 | hard reload             |
| 3 | force refresh           |
| 4 | refresh cache           |
| 5 | reload page             |
| 6 | clear browser cache     |
| 7 | DevTools                |

### Spanish (Espa&ntilde;ol)

| # | Term                    |
|---|-------------------------|
| 1 | limpiar caché           |
| 2 | recarga forzada         |
| 3 | forzar recarga          |
| 4 | actualizar caché        |
| 5 | recargar página         |
| 6 | borrar caché navegador  |
| 7 | DevTools                |

## Store listing copy

### English

**Short description** (under 132 chars — used by Chrome and Edge for the one-liner):

> One-click per-site cache clear and hard-reload. Four keyboard modes, zero telemetry, open source.

**Full description:**

```
A minimal, zero-dependency Chromium browser extension that clears the cache for the current site and hard-reloads it — in one click, with no settings to configure and no data leaving your browser.

When you need a bigger hammer, keyboard shortcuts and a right-click menu give you all-sites and deep-clear modes too.

No popups. No options page. No telemetry. No remote calls. ~150 lines of vanilla JS.

Features:
• Per-site cache clear by default — other sites' data stays untouched
• Four escalation modes: current site, all sites, deep clear (cache + cookies + storage), reload all tabs
• Keyboard shortcuts: Alt+Shift+R / A / D / W (customizable via chrome://extensions/shortcuts)
• Post-reload toast with cache hit/miss telemetry so you can verify the wipe worked
• Right-click context menu with all modes including "reopen in incognito"
• Available in English and Spanish
• Manifest V3, open source (GPL-3.0), zero dependencies
```

### Spanish (Espa&ntilde;ol)

**Short description:**

> Limpia la caché del sitio actual y recarga con un clic. Cuatro modos de teclado, cero telemetría, código abierto.

**Full description:**

```
Una extensión mínima para navegadores Chromium que limpia la caché del sitio actual y fuerza una recarga — en un solo clic, sin configuración y sin datos saliendo de tu navegador.

Cuando necesitas algo más fuerte, atajos de teclado y un menú contextual te dan modos de limpieza total y profunda.

Sin popups. Sin página de opciones. Sin telemetría. Sin llamadas remotas. ~150 líneas de JavaScript vanilla.

Características:
• Limpieza de caché por sitio — los datos de otros sitios no se tocan
• Cuatro modos: sitio actual, todos los sitios, limpieza profunda (caché + cookies + almacenamiento), recargar todas las pestañas
• Atajos de teclado: Alt+Shift+R / A / D / W (personalizables en chrome://extensions/shortcuts)
• Toast post-recarga con telemetría de caché para verificar que la limpieza funcionó
• Menú contextual con todos los modos incluyendo "reabrir en incógnito"
• Disponible en inglés y español
• Manifest V3, código abierto (GPL-3.0), cero dependencias
```

## Certification notes (Edge / Chrome reviewer field)

Paste this into the "Notes for certification" textarea when submitting. Reviewers see it; users don't.

```
No accounts, logins, or API keys needed. The extension works immediately after install.

Testing steps:
1. Pin the extension icon to the toolbar.
2. Navigate to any website (e.g. https://example.com).
3. Click the toolbar icon — the page reloads and a green toast appears in the top-right confirming the cache was cleared.
4. Right-click the toolbar icon to see all six modes (per-site, all-sites, deep clear, reload all tabs in window, reload all tabs in all windows, reopen in incognito).
5. Press Alt+Shift+R to test the keyboard shortcut (same as clicking the icon).
6. Press Alt+Shift+D on a site where you're logged in — cookies and storage are cleared, the page reloads, and you're logged out.

No hidden features, no remote services, no dependencies on other products. The entire extension is one service worker (~150 lines) that calls chrome.browsingData.remove and chrome.tabs.reload.

Permissions justification:
- browsingData: clear cache, Cache Storage, Service Workers, cookies, localStorage, IndexedDB
- tabs: read the active tab's URL for per-site scoping + reload
- contextMenus: right-click menu on the toolbar icon
- scripting: inject the confirmation toast into the reloaded page
- webRequest: read-only observation of post-reload requests for cache hit/miss telemetry in the toast
- <all_urls>: required for per-site cache scoping to work on any origin

Source code: https://github.com/isaiasgv/ClearCache
```

## Do NOT commit these

The generated PNGs in this folder should **not** be committed — re-running the build any time is cheap and they'd bloat the repo. The `.gitignore` at the repo root excludes them. The HTML sources under [`src/`](src/) and the build script ARE committed.
