# Security Policy

## Supported versions

Only the latest published version of the extension receives security fixes. Older versions are not patched.

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report them privately via [GitHub Security Advisories](https://github.com/isaiasgv/ClearCache/security/advisories/new). This sends the report directly to the maintainers and keeps it confidential until a fix is published.

When reporting, please include:

- A description of the issue and its impact (e.g. data exposure, privilege escalation, persistence across reloads).
- Steps to reproduce, ideally with a minimal proof-of-concept.
- The browser, browser version, and extension version where you observed the issue.
- Any suggested mitigation, if you have one.

## What to expect

- **Acknowledgement** within 7 days of report receipt.
- **Initial assessment** (severity, scope, reproducibility) within 14 days.
- **Fix and disclosure timeline** depend on severity. Critical issues will be patched and a new version published as soon as a working fix is verified; lower-severity issues may be bundled into the next monthly release.
- **Credit** in the release notes (or a CVE record, if applicable), unless you prefer to remain anonymous.

## Scope

In scope:

- Code in this repository (`background.js`, `manifest.json`, `_locales/`).
- Permissions or behaviors that expose user data beyond what's documented in [README.md](README.md).
- Privilege escalation via the extension's API surface.

Out of scope:

- Vulnerabilities in Chromium itself, or in any browser's `chrome.*` API surface — please report those to the relevant browser vendor.
- Social-engineering attacks against extension users.
- Issues that require an attacker to already have local code execution on the victim's machine.

## Hall of fame

Contributors who responsibly disclose security issues will be credited here, unless they request anonymity.

_(none yet)_
