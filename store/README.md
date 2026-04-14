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

## Do NOT commit these

The generated PNGs in this folder should **not** be committed — re-running the build any time is cheap and they'd bloat the repo. The `.gitignore` at the repo root excludes them. The HTML sources under [`src/`](src/) and the build script ARE committed.
