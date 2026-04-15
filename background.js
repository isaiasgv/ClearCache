// Clear browsing data and hard-reload the active tab.
//
// Modes (selected via toolbar click, keyboard shortcut, or context menu):
//   "origin" - clear cache/cacheStorage/serviceWorkers for the current site only (default)
//   "all"    - clear cache/cacheStorage/serviceWorkers for every site
//   "deep"   - clear cache + cookies + localStorage + indexedDB for the current site
//
// Per-origin scoping requires Chrome 114+ (see manifest.minimum_chrome_version).
// Firefox uses the same code path but swaps `origins: [...]` for `hostnames: [...]`
// in browsingData.remove — the two APIs are otherwise compatible.

import { originOf, hostnameOf } from "./lib/origin.js";
import { dataTypesFor } from "./lib/browser-compat.js";

// browser.runtime.getBrowserInfo is Firefox-only. Chrome/Edge/etc. do not expose it.
const IS_FIREFOX = typeof globalThis.browser?.runtime?.getBrowserInfo === "function";

// Build the per-site filter for browsingData.remove. Chrome accepts `origins`
// (full protocol+host+port); Firefox accepts `hostnames` (bare host, no port).
// If there's no usable origin (chrome://, file://, about:, etc.) callers should
// already have promoted the mode to "all" — but we still fall back to a global
// wipe here as a safety net.
function siteFilter(origin, url) {
  if (!origin) return { since: 0 };
  if (IS_FIREFOX) {
    const hostname = hostnameOf(url);
    return hostname ? { since: 0, hostnames: [hostname] } : { since: 0 };
  }
  return { since: 0, origins: [origin] };
}

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
const TOAST_MS = 2200;

const BADGE = {
  origin: { text: "\u2713", color: "#0a8a3a" },   // ✓ green
  all:    { text: "\u2605", color: "#d97706" },   // ★ amber
  deep:   { text: "\u2620", color: "#b91c1c" },   // ☠ red
  error:  { text: "!",      color: "#b91c1c" }
};

const TOAST_STYLE = {
  origin: { bg: "#0a8a3a", fg: "#ffffff", icon: "\u2713" },
  all:    { bg: "#d97706", fg: "#ffffff", icon: "\u2605" },
  deep:   { bg: "#b91c1c", fg: "#ffffff", icon: "\u2620" },
  error:  { bg: "#b91c1c", fg: "#ffffff", icon: "!" }
};

const TOAST_MESSAGE_ID = {
  origin: "toastOriginText",
  all:    "toastAllText",
  deep:   "toastDeepText",
  error:  "toastErrorText"
};

// Tracks tabs awaiting a post-reload toast: tabId -> mode key.
// Best-effort — survives normal reloads; lost only if the service worker is
// torn down between the reload trigger and the tab's "complete" event.
const pendingToasts = new Map();

// Per-tab cache-hit telemetry collected via chrome.webRequest after a reload.
// tabId -> { network, cached, startedAt }. Window of ~4s post-reload, then frozen.
const RELOAD_TELEMETRY_MS = 4000;
const reloadTelemetry = new Map();

function startTelemetry(tabId) {
  if (typeof tabId !== "number") return;
  reloadTelemetry.set(tabId, { network: 0, cached: 0, startedAt: Date.now() });
}

function consumeTelemetry(tabId) {
  const t = reloadTelemetry.get(tabId);
  reloadTelemetry.delete(tabId);
  return t ?? null;
}

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const t = reloadTelemetry.get(details.tabId);
    if (!t) return;
    if (Date.now() - t.startedAt > RELOAD_TELEMETRY_MS) return;
    if (details.fromCache) t.cached++;
    else t.network++;
  },
  { urls: ["<all_urls>"] }
);

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

// Runs in the target page's isolated world. Keep self-contained — closures
// over outer-scope identifiers are not available across the boundary.
function renderToast(opts) {
  const ID = "__clearcache_toast__";
  document.getElementById(ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  Object.assign(host.style, {
    position: "fixed",
    top: "16px",
    right: "16px",
    zIndex: "2147483647",
    padding: "10px 14px",
    background: opts.bg,
    color: opts.fg,
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "13px",
    fontWeight: "600",
    lineHeight: "1.3",
    borderRadius: "6px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    opacity: "0",
    transform: "translateY(-8px)",
    transition: "opacity 180ms ease-out, transform 180ms ease-out",
    pointerEvents: "none",
    maxWidth: "320px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  });

  const icon = document.createElement("span");
  icon.textContent = opts.icon;
  icon.style.fontSize = "16px";
  icon.style.lineHeight = "1";
  host.appendChild(icon);

  const text = document.createElement("span");
  text.textContent = opts.text;
  host.appendChild(text);

  (document.body || document.documentElement).appendChild(host);

  requestAnimationFrame(() => {
    host.style.opacity = "1";
    host.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    host.style.opacity = "0";
    host.style.transform = "translateY(-8px)";
    setTimeout(() => host.remove(), 220);
  }, opts.durationMs);
}

function formatTelemetrySuffix(t) {
  if (!t) return "";
  const total = t.network + t.cached;
  if (total === 0) return "";
  const fresh = chrome.i18n.getMessage("toastTelemetryFresh");
  const cached = chrome.i18n.getMessage("toastTelemetryCached");
  if (t.cached === 0) return ` (${t.network} ${fresh})`;
  return ` (${t.network} ${fresh}, ${t.cached} ${cached})`;
}

async function showToast(tabId, key) {
  if (typeof tabId !== "number") return;
  const style = TOAST_STYLE[key] ?? TOAST_STYLE.error;
  const baseText = chrome.i18n.getMessage(TOAST_MESSAGE_ID[key] ?? TOAST_MESSAGE_ID.error);
  const telemetry = consumeTelemetry(tabId);
  // If any subresources came back from cache after a clear, surface that as a warning.
  const warn = key !== "error" && telemetry && telemetry.cached > 0;
  const renderStyle = warn ? TOAST_STYLE.all : style; // amber/star for the partial-cache case
  const text = baseText + formatTelemetrySuffix(telemetry);
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: renderToast,
      args: [{ bg: renderStyle.bg, fg: renderStyle.fg, icon: renderStyle.icon, text, durationMs: TOAST_MS }]
    });
  } catch (err) {
    // Page disallows scripting (chrome://, edge://, store pages, view-source:).
    // Badge already fired as immediate feedback — silently skip.
  }
}

// Fires the queued toast when the reloaded tab finishes loading.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "complete") return;
  const mode = pendingToasts.get(tabId);
  if (!mode) return;
  pendingToasts.delete(tabId);
  showToast(tabId, mode);
});

async function clearAndReload(tab, mode) {
  const origin = originOf(tab?.url);

  // For modes that need an origin but the tab has none (chrome://, file://, etc.),
  // there's nothing usable to scope to — fall back to the global "all" wipe.
  const effectiveMode = mode !== "all" && !origin ? "all" : mode;

  const dataTypes = effectiveMode === "deep" ? DATA_DEEP : DATA_BASE;
  const filter = effectiveMode === "all"
    ? { since: 0 }
    : siteFilter(origin, tab?.url);

  let ok = true;
  try {
    await chrome.browsingData.remove(filter, dataTypesFor(IS_FIREFOX, dataTypes));
  } catch (err) {
    console.error("[ClearCache] Clear failed:", err);
    ok = false;
  }

  const feedbackKey = ok ? effectiveMode : "error";
  await flashBadge(tab?.id, feedbackKey);

  if (typeof tab?.id !== "number") return;
  pendingToasts.set(tab.id, feedbackKey);
  startTelemetry(tab.id);
  try {
    await chrome.tabs.reload(tab.id, { bypassCache: true });
  } catch (err) {
    console.error("[ClearCache] Reload failed:", err);
    pendingToasts.delete(tab.id);
    consumeTelemetry(tab.id);
  }
}

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
}

chrome.action.onClicked.addListener((tab) => clearAndReload(tab, "origin"));

async function clearOriginAndReloadTabs(tab, scope) {
  // scope: "window" -> only tabs in tab.windowId
  //        "all"    -> tabs across every window
  const origin = originOf(tab?.url);

  let ok = true;
  try {
    await chrome.browsingData.remove(siteFilter(origin, tab?.url), dataTypesFor(IS_FIREFOX, DATA_BASE));
  } catch (err) {
    console.error("[ClearCache] Clear failed:", err);
    ok = false;
  }

  const feedbackKey = ok ? "origin" : "error";
  await flashBadge(tab?.id, feedbackKey);

  // Show the toast on the originally active tab only — not on every reloaded
  // tab — to avoid a barrage of confirmations.
  if (typeof tab?.id === "number") {
    pendingToasts.set(tab.id, feedbackKey);
    startTelemetry(tab.id);
  }

  const query = scope === "all" ? {} : { windowId: tab?.windowId };
  if (scope !== "all" && typeof tab?.windowId !== "number") return;

  const tabs = await chrome.tabs.query(query);
  await Promise.all(
    tabs
      .filter((t) => typeof t.id === "number")
      .map((t) =>
        chrome.tabs.reload(t.id, { bypassCache: true }).catch((err) =>
          console.error(`[ClearCache] Reload of tab ${t.id} failed:`, err)
        )
      )
  );
}

async function deepClearAndReopenIncognito(tab) {
  const origin = originOf(tab?.url);
  const url = tab?.url;

  let ok = true;
  try {
    await chrome.browsingData.remove(siteFilter(origin, tab?.url), dataTypesFor(IS_FIREFOX, DATA_DEEP));
  } catch (err) {
    console.error("[ClearCache] Deep clear failed:", err);
    ok = false;
  }

  await flashBadge(tab?.id, ok ? "deep" : "error");

  if (!url || !ok) return;

  try {
    await chrome.windows.create({ url, incognito: true });
  } catch (err) {
    // Most common failure: extension is not allowed in incognito mode by user.
    console.error("[ClearCache] Could not open incognito window:", err);
    if (typeof tab?.id === "number") {
      // Inject a one-off error toast since there's no reload to attach to.
      const text = chrome.i18n.getMessage("toastIncognitoBlockedText");
      const style = TOAST_STYLE.error;
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: renderToast,
          args: [{ bg: style.bg, fg: style.fg, icon: style.icon, text, durationMs: TOAST_MS + 1500 }]
        });
      } catch { /* page disallows scripting */ }
    }
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  const tab = await activeTab();
  if (!tab) return;
  if (command === "clear-all-origins")   return clearAndReload(tab, "all");
  if (command === "clear-deep")          return clearAndReload(tab, "deep");
  if (command === "reload-all-tabs")     return clearOriginAndReloadTabs(tab, "window");
  if (command === "reload-all-windows")  return clearOriginAndReloadTabs(tab, "all");
});

const MENU_ITEMS = [
  { id: "clearcache-origin",        messageId: "menuOriginTitle",          handler: (tab) => clearAndReload(tab, "origin") },
  { id: "clearcache-all",           messageId: "menuAllTitle",             handler: (tab) => clearAndReload(tab, "all")    },
  { id: "clearcache-deep",          messageId: "menuDeepTitle",            handler: (tab) => clearAndReload(tab, "deep")   },
  { id: "clearcache-window-tabs",   messageId: "menuReloadAllTabsTitle",   handler: (tab) => clearOriginAndReloadTabs(tab, "window") },
  { id: "clearcache-all-windows",   messageId: "menuReloadAllWindowsTitle", handler: (tab) => clearOriginAndReloadTabs(tab, "all") },
  { id: "clearcache-incognito",     messageId: "menuReopenIncognitoTitle", handler: (tab) => deepClearAndReopenIncognito(tab) }
];

async function installContextMenus() {
  // Chrome MV3 and Firefox both return Promises from contextMenus.removeAll;
  // the legacy callback form would break Firefox.
  await chrome.contextMenus.removeAll();
  for (const item of MENU_ITEMS) {
    chrome.contextMenus.create({
      id: item.id,
      title: chrome.i18n.getMessage(item.messageId),
      contexts: ["action"]
    });
  }
}

chrome.runtime.onInstalled.addListener(installContextMenus);
chrome.runtime.onStartup.addListener(installContextMenus);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return;
  const item = MENU_ITEMS.find((m) => m.id === info.menuItemId);
  if (item) item.handler(tab);
});
