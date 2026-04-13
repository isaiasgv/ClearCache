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

const BADGE_MS = 1500;

const BADGE = {
  origin: { text: "\u2713", color: "#0a8a3a" },   // ✓ green
  all:    { text: "\u2605", color: "#d97706" },   // ★ amber
  deep:   { text: "\u2620", color: "#b91c1c" },   // ☠ red
  error:  { text: "!",      color: "#b91c1c" }
};

async function flashBadge(tabId, key) {
  if (typeof tabId !== "number") return;
  const { text, color } = BADGE[key] ?? BADGE.error;
  try {
    await chrome.action.setBadgeBackgroundColor({ color, tabId });
    await chrome.action.setBadgeText({ text, tabId });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "", tabId }).catch(() => {});
    }, BADGE_MS);
  } catch (err) {
    console.error("[ClearCache] Badge update failed:", err);
  }
}

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

  let ok = true;
  try {
    await chrome.browsingData.remove(filter, dataTypes);
  } catch (err) {
    console.error("[ClearCache] Clear failed:", err);
    ok = false;
  }

  await flashBadge(tab?.id, ok ? effectiveMode : "error");

  if (typeof tab?.id !== "number") return;
  try {
    await chrome.tabs.reload(tab.id, { bypassCache: true });
  } catch (err) {
    console.error("[ClearCache] Reload failed:", err);
  }
}

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
}

chrome.action.onClicked.addListener((tab) => clearAndReload(tab, "origin"));

chrome.commands.onCommand.addListener(async (command) => {
  const tab = await activeTab();
  if (!tab) return;
  if (command === "clear-all-origins") return clearAndReload(tab, "all");
  if (command === "clear-deep")        return clearAndReload(tab, "deep");
});
