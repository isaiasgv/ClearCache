# Screenshots

Screenshots referenced from the main [README.md](../../README.md) live here.

## What to capture

| Filename               | What it shows                                                              |
| ---------------------- | -------------------------------------------------------------------------- |
| `toolbar-icon.png`     | Toolbar with the extension icon pinned, tooltip visible.                   |
| `badge-confirmation.png` | Toolbar icon with the green ✓ badge after a successful clear.             |
| `context-menu.png`     | Right-click toolbar menu open, showing all four entries.                   |
| `keyboard-shortcuts.png` | `chrome://extensions/shortcuts` page showing the four bindings.          |

## Capture conventions

- **Resolution:** 1280×800 native (no scaling), PNG, no compression.
- **Browser chrome:** keep it minimal — single tab, blank or neutral page (`https://example.com`).
- **Sensitive data:** never capture real auth cookies, profile names, bookmarks, or extension lists in the screenshot frame.
- **Theme:** light theme. (Dark-theme variants can come later if needed.)

## Update cadence

Re-capture only when:

- A user-visible feature lands that changes the toolbar/menu/badge appearance.
- Chrome ships a major UI redesign that makes existing screenshots look outdated.

These files are committed to the repo (not auto-built) — change them in the same PR as the feature that affects them.
