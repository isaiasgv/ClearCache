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

// Minimal multi-label public-suffix list. Not a PSL replacement — a pragmatic
// shortcut for the registrable-domain heuristic below. Expand when a real
// user hits a false positive (e.g. docs.something.amazonaws.com rolling up
// to .amazonaws.com incorrectly).
const MULTI_LABEL_SUFFIXES = new Set([
  "co.uk", "co.jp", "co.kr", "co.in", "co.nz", "co.za",
  "com.au", "com.br", "com.mx", "com.cn", "com.hk",
  "org.uk", "net.au", "gov.uk",
  "github.io", "gitlab.io",
  "herokuapp.com", "vercel.app", "netlify.app",
  "pages.dev", "workers.dev"
]);

/**
 * Return the registrable domain ("eTLD+1") of a hostname using a tiny
 * built-in allow-list for common multi-label suffixes. Good enough for the
 * "clear this site + subdomains" use case without bundling a full PSL.
 *
 * Examples:
 *   www.example.com       -> example.com
 *   api.sub.example.com   -> example.com
 *   api.example.co.uk     -> example.co.uk
 *   user.github.io        -> user.github.io   (github.io is a public suffix)
 *   localhost             -> localhost        (single label, kept as-is)
 *   127.0.0.1             -> 127.0.0.1        (IP address, kept as-is)
 *
 * @param {string | null | undefined} hostname
 * @returns {string | null}
 */
export function registrableDomain(hostname) {
  if (!hostname || typeof hostname !== "string") return null;
  // IPv4 literal: don't try to split an address into "registrable" chunks.
  if (/^[\d.]+$/.test(hostname)) return hostname;
  // IPv6 literal arrives in URL form as [::1]; hostname gives us ::1 — keep as-is.
  if (hostname.includes(":")) return hostname;
  const parts = hostname.split(".").filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length <= 2) return hostname;
  const last2 = parts.slice(-2).join(".");
  if (MULTI_LABEL_SUFFIXES.has(last2)) return parts.slice(-3).join(".");
  return last2;
}

/**
 * Given the URL the user invoked the action from and the list of all open
 * tabs, return a Set of http(s) origins whose hostname shares the same
 * registrable domain as the current URL. Non-web tabs are skipped. If the
 * current URL is not web-scoped, returns an empty Set.
 *
 * The current tab's own origin is included if web-scoped, because the
 * current tab is expected to be among the `allTabs` list.
 *
 * @param {string | null | undefined} currentUrl
 * @param {Array<{url?: string}>} allTabs
 * @returns {Set<string>}
 */
export function siblingOrigins(currentUrl, allTabs) {
  const origins = new Set();
  const baseHostname = hostnameOf(currentUrl);
  if (!baseHostname) return origins;
  const baseRd = registrableDomain(baseHostname);
  if (!baseRd) return origins;
  for (const t of allTabs ?? []) {
    const o = originOf(t?.url);
    const h = hostnameOf(t?.url);
    if (o && h && registrableDomain(h) === baseRd) origins.add(o);
  }
  return origins;
}
