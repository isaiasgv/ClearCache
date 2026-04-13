# Contributing to ClearCache

Thanks for your interest in contributing! This is a deliberately small project, so the contribution process is short.

## Before you start

- Open an **issue** before significant work. A two-line description of the problem and proposed approach is enough — it saves you from writing a PR that conflicts with the project's scope.
- Read [CLAUDE.md](CLAUDE.md) — its rules apply to all contributors (human or AI-assisted), not just AI assistants. The most important ones:
  - **No AI-assistant attribution** in commit messages, trailers, author/committer fields, or PR descriptions. Commits must be authored by a human identity and read as if written by a human.
  - **No new dependencies, permissions, telemetry, or build steps** without explicit discussion in an issue first.
  - **Manifest V3 only.**

## Development setup

There is no toolchain. Clone the repo, load the folder as an unpacked extension in `chrome://extensions`, and edit files directly. Reload the extension card after each change.

## Branching model

- **`release`** is the active development branch. **All feature/fix PRs target `release`.**
- **`main`** is stable and mirrors what's in the stores. It receives a PR from `release` once a month.
- Hotfixes are the only thing that may PR directly to `main`.

```
   your-feature-branch ──▶ release ──(monthly PR)──▶ main ──▶ auto-version + GitHub Release
```

## Conventional Commits (required)

Every commit subject must follow [Conventional Commits](https://www.conventionalcommits.org/) — CI rejects PRs that don't. The version bump on each release is computed from these prefixes:

| Prefix                                | Meaning                          | Release impact |
| ------------------------------------- | -------------------------------- | -------------- |
| `feat!:` / `fix!:` / `BREAKING CHANGE:` in body | Breaking change         | **major**      |
| `feat:`                               | New user-visible feature         | **minor**      |
| `fix:` / `perf:` / `refactor:`        | Bug fix / perf / safe refactor   | **patch**      |
| `docs:` / `test:` / `chore:` / `ci:` / `build:` / `style:` / `revert:` | Maintenance | **none**       |

Examples:

```
feat: add keyboard shortcut to trigger reload
fix: handle tabs without an id (e.g. devtools)
feat!: drop Firefox compatibility shim
docs: clarify install steps in README
```

## Pull requests

- Target `release` (not `main`) unless it's a hotfix.
- One logical change per PR. Keep diffs reviewable.
- **Do not** edit `manifest.json` `"version"` manually — the release workflow owns that field.
- Update [README.md](README.md) if you change behavior, permissions, or installation steps.
- Write commit messages in the imperative mood ("Add X", not "Added X" or "Adds X").
- Squash trivial fixup commits before requesting review.

## Reporting bugs

Open an issue with:

1. Browser name and version.
2. Steps to reproduce.
3. Expected vs. actual behavior.
4. Any errors from the service-worker DevTools console (look for the `[ClearCache]` prefix).

## License

By contributing, you agree that your contributions will be licensed under the [GNU General Public License v3.0](LICENSE).
