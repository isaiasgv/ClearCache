// Populates the About page. MV3 page CSP forbids inline scripts, so all DOM
// text is set here rather than in about.html. Two jobs:
//   1. Stamp the running version straight from the manifest (always accurate —
//      the release workflow rewrites manifest.version, never this file).
//   2. Localize every [data-i18n] node via the same _locales strings the rest
//      of the extension uses, reusing the existing menu titles for the feature
//      list so there's a single source of truth.
//
// The Oribion brand strings ("Part of the Oribion Family of Companies",
// "Powered By Oribion") are intentionally hardcoded in about.html — they are
// fixed brand constants and must not be reworded or localized.

const api = globalThis.chrome ?? globalThis.browser;

document.getElementById("version").textContent = api.runtime.getManifest().version;

for (const el of document.querySelectorAll("[data-i18n]")) {
  const msg = api.i18n.getMessage(el.dataset.i18n);
  if (msg) el.textContent = msg;
}
