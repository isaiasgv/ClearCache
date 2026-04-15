# CLAUDE.md

Guidance for Claude (and any other AI coding assistant) when working in this repository.

## Project summary

ClearCache is a Manifest V3 browser extension (Chromium and Firefox) that clears browsing cache (HTTP cache, Cache Storage, Service Workers, optionally cookies/storage) and hard-reloads tabs. The codebase is intentionally tiny:

- [background.js](background.js) — the entire runtime: action click + commands + context menus, all routed through one `clearAndReload(tab, mode)` function. Modes: `"origin"` (default, current site only), `"all"` (every site), `"deep"` (current site + cookies/storage). Plus `clearOriginAndReloadWindow` for the multi-tab variant. `IS_FIREFOX` + `siteFilter()` route the per-site filter between Chrome's `origins` and Firefox's `hostnames`.
- [manifest.json](manifest.json) — Chromium MV3 manifest (service worker, `minimum_chrome_version: 114`).
- [manifest.firefox.json](manifest.firefox.json) — Firefox MV3 manifest (event page via `background.scripts`, `browser_specific_settings.gecko`, `strict_min_version: 109.0`). The release workflow ships this file renamed to `manifest.json` inside the Firefox zip.
- [_locales/en/messages.json](_locales/en/messages.json) — all user-facing strings. Add new locales by copying this folder.
- [icons/](icons/) — toolbar icons at 16/32/48/128 px.

There is no build step, no bundler, no package manager, and no test framework. Edits to `background.js`, `manifest.json`, or `_locales/` are loaded by reloading the unpacked extension in `chrome://extensions`.

## Hard rules

### 1. No AI-assistant attribution in git history — ever

It is **strictly prohibited** to include any reference to Claude, Anthropic, Claude Code, Copilot, ChatGPT, Cursor, or any other AI assistant in:

- commit messages (subject or body)
- commit trailers (`Co-Authored-By`, `Generated-By`, `Assisted-By`, etc.)
- the author or committer fields (`git config user.name` / `user.email` must remain the human contributor's identity)
- pull request titles or descriptions
- code comments that exist solely to credit the assistant

This means: **do not append** `Co-Authored-By: Claude …`, **do not add** `🤖 Generated with Claude Code`, **do not write** "AI-assisted" in PR bodies, and **do not** use a `--author` flag that points at an assistant identity.

When committing on the user's behalf, use only the user's configured git identity and write the commit message as if a human authored it. If the user explicitly overrides this rule for a specific commit, follow the override for that commit only.

### 2. Keep it minimal

- **No third-party runtime dependencies.** The shipped extension imports nothing from npm, no bundlers, no frameworks.
- **Dev/build tooling `devDependencies` are the one allowed exception.** Current devDeps:
  - `vitest` — runs unit tests on pure helpers under Node.
  - `puppeteer-core` — drives headless Chrome/Edge via `store/build-assets.mjs` to generate extension icons, landing assets, and store promo tiles at exact pixel dimensions. Needed because `chrome --screenshot` enforces a minimum window width on Windows (~484px), breaking renders below 128×128.

  Neither is bundled into the extension zip — the release workflow's zip step only copies `manifest.json`, `background.js`, `LICENSE`, `icons/`, `_locales/`, and `lib/`. Justify any new devDep in its PR.
- No new permissions in `manifest.json` without a documented reason in the PR.
- No telemetry, analytics, remote calls, or background fetches.
- No popup UI, options page, or content scripts unless the feature genuinely requires it.

### 3. Manifest V3 only

Do not propose Manifest V2 patterns (background pages, `chrome.extension.*`, persistent background scripts). All work targets MV3 — service workers on Chromium, event pages on Firefox (Firefox does not yet support MV3 service workers, which is why `manifest.firefox.json` uses `background.scripts`).

### 4. Branching and versioning are automated — don't fight them

- Day-to-day work happens on the **`release`** branch. PRs target `release`. This includes **hotfixes** — they go through `release` first so every change gets a prerelease build before hitting the stable branch, and `main` stays a pure mirror of what shipped.
- **`main`** is the stable branch. A PR brings `release` into `main` when a batch of commits is ready to ship (typically monthly, or sooner for a hotfix). Pushes to `main` trigger the stable release workflow.
- **No direct PRs to `main`** — all work, features and fixes alike, lands on `release` first. For an urgent hotfix, land the `fix:` on `release`, let the prerelease build confirm it, then immediately PR `release` → `main`.
- **Never edit `manifest.json` `"version"` manually.** The [Release workflow](.github/workflows/release.yml) computes the next semver from Conventional Commits and bumps the field itself. Manual edits will be overwritten and confuse the version-derivation logic. The same applies to `manifest.firefox.json` — the workflow bumps both in lockstep.
- Every commit subject must follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>[!]: <description>`. Allowed types: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`, `style`, `revert`. CI rejects PRs that don't conform.
- Bump policy: any releasable commit (`feat`/`fix`/`perf`/`refactor`, with or without `!`) defaults to **patch**. To request a minor or major bump, add `Release-Bump: minor` or `Release-Bump: major` to the commit body, or trigger the workflow manually with `bump_override`. `BREAKING CHANGE:` and `!` no longer auto-bump beyond patch — they're informational only. Non-releasable types: `docs`, `test`, `chore`, `ci`, `build`, `style`, `revert`.

## Working with the code

- **Testing changes**: load the folder via `chrome://extensions` → *Load unpacked*. After edits, click the reload icon on the extension card.
- **Debugging the service worker**: from `chrome://extensions`, click *Service worker* under the ClearCache card to open DevTools for `background.js`. Logs from `console.error("[ClearCache] …")` land there.
- **Icons**: the four sizes in [icons/](icons/) are referenced from both `action.default_icon` and the top-level `icons` block in the manifest. Keep both in sync if icons are renamed.
- **Versioning**: bump `manifest.json` `version` (semver) when shipping a user-visible change.

## Style

- Vanilla ES2022+ in service-worker context. Use `async/await`, not `.then()` chains.
- Prefer `chrome.*` Promise-returning APIs over the legacy callback forms.
- Keep error handling close to the API call, log with the `[ClearCache]` prefix, and never swallow errors silently without a log line.
- No comments restating what the code obviously does. Comments are for *why*, not *what*.

## Out of scope

Do not, without an explicit request:

- Add a popup, options page, or settings persistence.
- Add per-site scoping or a domain allowlist.
- Add Safari support (different extension model, requires an Xcode wrapper, and imposes a $99/year Apple Developer Program fee).
- Add a build pipeline, TypeScript, linting, or CI.
- Refactor the single listener into modules.
