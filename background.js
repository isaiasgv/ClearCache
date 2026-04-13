// Clears browsing cache and performs a hard reload of the active tab
// when the toolbar icon is clicked.

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Clear cache (and related web-perf data) for all origins.
    // `browsingData.removeCache` is the most reliable cross-browser option.
    await chrome.browsingData.remove(
      { since: 0 },
      {
        cache: true,
        cacheStorage: true,
        serviceWorkers: true
      }
    );
  } catch (err) {
    console.error("[ClearCache] Failed to clear cache:", err);
  }

  if (!tab || typeof tab.id !== "number") return;

  try {
    // `bypassCache: true` forces a hard reload (equivalent to Ctrl+Shift+R).
    await chrome.tabs.reload(tab.id, { bypassCache: true });
  } catch (err) {
    console.error("[ClearCache] Failed to reload tab:", err);
  }
});
