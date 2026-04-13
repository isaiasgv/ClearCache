// Clear browsing data and hard-reload the active tab.
//
// Modes (selected via toolbar click, keyboard shortcut, or context menu):
//   "origin" - clear cache/cacheStorage/serviceWorkers for the current site only (default)
//   "all"    - clear cache/cacheStorage/serviceWorkers for every site
//   "deep"   - clear cache + cookies + localStorage + indexedDB for the current site
//
// Per-origin scoping requires Chrome 114+ (see manifest.minimum_chrome_version).

const DATA_BASE = {
  cache: true,
  cacheStorage: true,
  serviceWorkers: true
};

const DATA_DEEP = {
  ...DATA_BASE,
  cookies: true,
  localStorage: true,
  indexedDB: true
};

function originOf(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.origin : null;
  } catch {
    return null;
  }
}

async function clearAndReload(tab, mode) {
  const origin = originOf(tab?.url);

  // For modes that need an origin but the tab has none (chrome://, file://, etc.),
  // there's nothing usable to scope to — fall back to the global "all" wipe.
  const effectiveMode = mode !== "all" && !origin ? "all" : mode;

  const dataTypes = effectiveMode === "deep" ? DATA_DEEP : DATA_BASE;
  const filter = effectiveMode === "all"
    ? { since: 0 }
    : { since: 0, origins: [origin] };

  try {
    await chrome.browsingData.remove(filter, dataTypes);
  } catch (err) {
    console.error("[ClearCache] Clear failed:", err);
  }

  if (typeof tab?.id !== "number") return;
  try {
    await chrome.tabs.reload(tab.id, { bypassCache: true });
  } catch (err) {
    console.error("[ClearCache] Reload failed:", err);
  }
}

chrome.action.onClicked.addListener((tab) => clearAndReload(tab, "origin"));
