# Plan: Add Firefox Support + Update Docs

## Context

ClearCache is currently Chromium-only. Firefox is the largest non-Chromium browser with extension support, and its add-on store is **free** (no registration fee). The goal is to ship Firefox MV3 support with a single shared `background.js`, a separate Firefox manifest, and a release workflow that produces two zips — then update all documentation (CLAUDE.md, README.md, landing page) to reflect the new browser support.

The critical API difference: Chrome's `browsingData.remove` uses `origins: ["https://example.com"]` for per-site scoping; Firefox uses `hostnames: ["example.com"]` instead.

---

## Part 1: Firefox Extension Support

### 1.1 Add `hostnameOf` helper to `lib/origin.js`

Export a new `hostnameOf(url)` function that returns the bare hostname (no protocol/port) for http/https URLs, `null` otherwise. Firefox's `browsingData.remove` needs this format.

```js
export function hostnameOf(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.hostname : null;
  } catch { return null; }
}
```

### 1.2 Add tests for `hostnameOf` in `tests/origin.test.js`

Mirror the existing `originOf` test structure:
- `https://example.com/path` -> `"example.com"`
- `https://sub.example.com:8080/x` -> `"sub.example.com"` (port stripped)
- `http://localhost:3000/` -> `"localhost"`
- Non-web URLs (`chrome://`, `file://`, `about:`) -> `null`
- Invalid input (`null`, `undefined`, empty string) -> `null`

### 1.3 Adapt `background.js` for cross-browser

**4 small changes:**

1. **Import**: add `hostnameOf` to the import from `./lib/origin.js`

2. **Browser detection + filter helper** (add near top, after constants):
   ```js
   const IS_FIREFOX = typeof globalThis.browser?.runtime?.getBrowserInfo === "function";

   function siteFilter(origin, url) {
     if (!origin) return { since: 0 };
     if (IS_FIREFOX) {
       const hostname = hostnameOf(url);
       return hostname ? { since: 0, hostnames: [hostname] } : { since: 0 };
     }
     return { since: 0, origins: [origin] };
   }
   ```

3. **Replace 3 inline filter constructions** with `siteFilter(origin, tab?.url)`:
   - `clearAndReload` (line ~199-201)
   - `clearOriginAndReloadTabs` (line ~240-241)
   - `deepClearAndReopenIncognito` (line ~280-281)

4. **Fix `installContextMenus`** (line 331-341): convert from callback to `async/await` so it works in both Chrome MV3 and Firefox:
   ```js
   async function installContextMenus() {
     await chrome.contextMenus.removeAll();
     for (const item of MENU_ITEMS) { ... }
   }
   ```

### 1.4 Create `manifest.firefox.json`

Copy of `manifest.json` with 3 differences:
- `"background": { "scripts": ["background.js"], "type": "module" }` (not `service_worker`)
- Remove `"minimum_chrome_version": "114"`
- Add:
  ```json
  "browser_specific_settings": {
    "gecko": {
      "id": "clearcache@isaiasgv",
      "strict_min_version": "109.0"
    }
  }
  ```

### 1.5 Update CI workflow (`.github/workflows/ci.yml`)

Add validation steps for `manifest.firefox.json`:
- Valid JSON
- Has required fields (including `browser_specific_settings`)
- Uses `background.scripts` (not `service_worker`)
- Version matches `manifest.json`

### 1.6 Update release workflow (`.github/workflows/release.yml`)

- Produce **two zips**: `clearcache-X.Y.Z.zip` (Chromium) and `clearcache-firefox-X.Y.Z.zip`
- Firefox zip copies `manifest.firefox.json` as `manifest.json` inside the zip
- Bump version in both manifest files
- SHA-256 checksums for both zips
- Upload both to GitHub Release
- Commit both manifests in the version-bump step

---

## Part 2: Documentation Updates

### 2.1 Update `CLAUDE.md`

- **Project summary**: mention Firefox support, add `manifest.firefox.json` to file list
- **Hard rule 3**: change "MV3 service workers" to "MV3 (service workers on Chromium, event pages on Firefox)"
- **Out of scope**: remove the Firefox bullet entirely

### 2.2 Update `README.md`

- **Description** (line 22): "Chromium browser extension" -> "browser extension for Chrome, Edge, and Firefox"
- **Browser compatibility table**: Firefox row -> "Supported (Firefox 109+)"
- **Install section**: add Firefox side-load instructions (`about:debugging#/runtime/this-firefox` -> Load Temporary Add-on)
- **Store submission**: add Firefox Add-ons (AMO) to the list
- **Project layout**: add `manifest.firefox.json`

### 2.3 Update `landing/index.html`

- **Meta description** (line 7): add Firefox
- **Pills** (line 276-281): add `Firefox 109+` pill
- **Install section** (~line 404): add Firefox install instructions + note about `clearcache-firefox-X.Y.Z.zip`
- **Permissions table**: mention both `chrome.browsingData` and `browser.browsingData`

---

## Known Limitations to Document

1. **Port-scoped sites on Firefox**: `hostnames` filter ignores ports, so clearing `localhost:3000` also clears `localhost:8080`. This is a Firefox API limitation.
2. **Temporary install**: side-loaded Firefox extensions are temporary (removed on restart). Permanent install requires AMO signing.

---

## Verification

1. Run `npm test` — confirms `hostnameOf` helper works
2. Load unpacked in Chrome — confirm all 4 modes still work (no regression)
3. Load temporary add-on in Firefox (`about:debugging`) — confirm:
   - Toolbar click clears current site cache + reloads
   - `Alt+Shift+A` clears all sites
   - `Alt+Shift+D` deep-clears
   - Context menu items appear and work
   - Toast appears after reload
   - Badge flashes correctly
4. Run CI workflow — confirms both manifests validate
5. Trigger release workflow (or inspect the build step) — confirms two zips are produced with correct contents

---

## Commit Plan

All work targets the `release` branch per project convention.

| Commit | Type | Description |
|--------|------|-------------|
| 1 | `feat:` | add Firefox MV3 support (hostnameOf helper, browser detection, manifest.firefox.json) |
| 2 | `ci:` | validate Firefox manifest in CI and produce two release zips |
| 3 | `docs:` | update CLAUDE.md, README.md, and landing page for Firefox support |

---

## Publishing to All Stores (Reference)

| Store | Fee | Code changes needed | Setup time |
|---|---|---|---|
| **Chrome Web Store** | $5 one-time | None | ~15 min |
| **Edge Add-ons** | Free | None (same Chromium zip) | ~5 min |
| **Opera Add-ons** | Free | None (same Chromium zip) | ~5 min |
| **Firefox Add-ons (AMO)** | Free | This plan | ~5 min after code is ready |
| **Total** | **$5** | | |
