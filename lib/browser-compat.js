// Pure cross-browser compatibility helpers. No imports of chrome.* APIs here —
// keep this module side-effect-free so it can be loaded directly under Node
// for tests.

// Keys supported by Chrome's browsingData.remove but NOT by Firefox's.
// Passing them to Firefox causes a validation throw that aborts the entire
// clear operation. Strip them when running on Firefox.
const FIREFOX_UNSUPPORTED_DATA_TYPES = new Set(["cacheStorage", "serviceWorkers"]);

/**
 * Return a browsingData.remove dataTypes object filtered for the current
 * browser. On Chrome, returns the input unchanged. On Firefox, returns a
 * new object with keys Firefox does not understand stripped out.
 *
 * Does not mutate the input object.
 *
 * @param {boolean} isFirefox
 * @param {Record<string, boolean>} dataTypes
 * @returns {Record<string, boolean>}
 */
export function dataTypesFor(isFirefox, dataTypes) {
  if (!isFirefox) return dataTypes;
  const out = {};
  for (const [k, v] of Object.entries(dataTypes)) {
    if (!FIREFOX_UNSUPPORTED_DATA_TYPES.has(k)) out[k] = v;
  }
  return out;
}
