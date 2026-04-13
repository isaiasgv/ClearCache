# CLAUDE.md

Guidance for Claude (and any other AI coding assistant) when working in this repository.

## Project summary

ClearCache is a Manifest V3 browser extension that clears browsing cache (HTTP cache, Cache Storage, Service Workers, optionally cookies/storage) and hard-reloads tabs. The codebase is intentionally tiny:

- [background.js](background.js) — the entire runtime: action click + commands + context menus, all routed through one `clearAndReload(tab, mode)` function. Modes: `"origin"` (default, current site only), `"all"` (every site), `"deep"` (current site + cookies/storage). Plus `clearOriginAndReloadWindow` for the multi-tab variant.
- [manifest.json](manifest.json) — MV3 manifest, permissions, icons, keyboard `commands`, i18n placeholders (`__MSG_*__`).
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
- **Test-only `devDependencies` are the one allowed exception.** `vitest` lives in `package.json` for running pure-helper unit tests under Node. It is never bundled into the extension zip — the release workflow's zip step only copies `manifest.json`, `background.js`, `LICENSE`, `icons/`, `_locales/`, and `lib/`. If you find yourself wanting to add another devDep, justify it in the PR.
- No new permissions in `manifest.json` without a documented reason in the PR.
- No telemetry, analytics, remote calls, or background fetches.
- No popup UI, options page, or content scripts unless the feature genuinely requires it.

### 3. Manifest V3 only

Do not propose Manifest V2 patterns (background pages, `chrome.extension.*`, persistent background scripts). All work targets MV3 service workers.

### 4. Branching and versioning are automated — don't fight them

- Day-to-day work happens on the **`release`** branch. PRs target `release`.
- **`main`** is the stable branch. A monthly PR brings `release` into `main`. Pushes to `main` trigger the release workflow.
- **Never edit `manifest.json` `"version"` manually.** The [Release workflow](.github/workflows/release.yml) computes the next semver from Conventional Commits and bumps the field itself. Manual edits will be overwritten and confuse the version-derivation logic.
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
- Add Firefox support (the `browsingData` surface differs and would require a fork of `background.js`).
- Add a build pipeline, TypeScript, linting, or CI.
- Refactor the single listener into modules.
