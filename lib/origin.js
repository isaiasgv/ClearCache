// Pure helpers shared between the service worker and the test suite.
// No imports of chrome.* APIs here — keep this module side-effect-free
// so it can be loaded directly under Node for tests.

/**
 * Extract the http(s) origin from a URL.
 * Returns null for any non-web URL (chrome://, edge://, file://, about:,
 * data:, view-source:, blob:, etc.) or for input that can't be parsed.
 *
 * The per-site cache scoping in chrome.browsingData.remove only accepts
 * web origins, so anything else has to fall back to the global wipe.
 *
 * @param {string | undefined | null} url
 * @returns {string | null}
 */
export function originOf(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.origin : null;
  } catch {
    return null;
  }
}

/**
 * Extract the bare hostname (no protocol, no port) from an http(s) URL.
 * Returns null for any non-web URL or unparseable input.
 *
 * Firefox's browser.browsingData.remove accepts a `hostnames` array (not
 * `origins`), so Firefox cannot reuse originOf's output directly.
 *
 * @param {string | undefined | null} url
 * @returns {string | null}
 */
export function hostnameOf(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.hostname : null;
  } catch {
    return null;
  }
}
