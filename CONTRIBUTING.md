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

Every commit subject must follow [Conventional Commits](https://www.conventionalcommits.org/) — CI rejects PRs that don't.

| Prefix                                                                  | Triggers a release? |
| ----------------------------------------------------------------------- | ------------------- |
| `feat:` / `fix:` / `perf:` / `refactor:` (with or without `!`)          | **yes** — patch by default (see below) |
| `docs:` / `test:` / `chore:` / `ci:` / `build:` / `style:` / `revert:`  | no                  |

### Bump policy

By default, **any releasable commit produces a patch bump**. Even `feat!:` and `BREAKING CHANGE:` do not auto-bump beyond patch — this project deliberately stays in `0.x` and bumps minor/major only when stated.

To request a higher bump, **state it** via either:

- A `Release-Bump:` trailer in any commit body in the release range:

  ```
  feat: drop Manifest V2 support

  Release-Bump: major
  ```

- Manually triggering the Release workflow with `bump_override = minor` or `major` from the Actions tab.

The highest level signaled across all commits in a release range wins. If no `Release-Bump:` trailer is present and no manual override is used, the release is patch.

### Commit subject examples

```
feat: add keyboard shortcut to trigger reload
fix: handle tabs without an id (e.g. devtools)
docs: clarify install steps in README

# When you want a minor bump, signal it in the body:
feat: rework the toast renderer

Release-Bump: minor
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
