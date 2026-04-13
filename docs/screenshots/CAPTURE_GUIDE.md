# Screenshot capture guide

Both the Chrome Web Store and the Microsoft Edge Add-ons dashboard want **1280×800** PNG screenshots of the extension in action. Up to 5 (Chrome) or 6 (Edge). This document tells you exactly what to capture and how.

Store policy requires screenshots to show **real extension functionality**, not mockups — that's why the build script in `store/` only generates promo tiles (which are allowed to be marketing-designed) and not screenshots.

## Prep (do once, reuse for every capture)

1. Open a fresh Chrome profile with ClearCache loaded as unpacked.
2. Pin the ClearCache icon to the toolbar.
3. Set the browser window to **exactly 1280×800** (see sizing methods below).
4. Use the **light theme** of the browser and OS. (Dark variants can come later.)
5. Close DevTools, extensions panels, tab groups, and anything else that clutters the chrome.
6. Disable other pinned extensions (right-click → Unpin) so the toolbar isn't busy.
7. Zoom level: **100%** (`Ctrl+0`).

### Three ways to size the window to 1280×800

- **Easiest — Chrome DevTools Device Mode:** `F12` → `Ctrl+Shift+M` → custom dimensions `1280 × 800` → capture with DevTools' camera icon ("Capture screenshot"). Produces an exact-pixel PNG directly.
- **Manual resize:** drag the window to roughly 1280×800 and use an extension like [GoFullPage](https://gofullpage.com) or the OS screenshot tool with a cropping step afterward.
- **Headless Chrome (for automation):** `chrome --headless=new --window-size=1280,800 --screenshot=out.png https://...` — but this won't show the extension toolbar, so it's not useful here.

**Use DevTools device mode.** It's the cleanest path.

---

## The shot list (4 screenshots + 1 optional)

### 1. Hero — `01-hero-1280x800.png`

**Composition:** a real development page with the toolbar icon visible (with badge) AND the toast visible.

**Steps:**

1. Open a localhost dev server URL (or a real site like `https://news.ycombinator.com/` if you don't have one — pick one whose content looks professional).
2. Click the ClearCache toolbar icon. The page will reload.
3. The toast appears in the top-right ~300ms after the reload completes.
4. The badge on the toolbar icon shows `✓` (green).
5. **Capture while both are visible** — you have ~2 seconds. Use DevTools device mode's "Capture screenshot" button during that window.
6. If you miss the window, click again; the toast re-appears on every click.

**What the shot should show:**

- A page with recognizable web content (don't use `about:blank` or a 404)
- The green `✓` badge on the toolbar icon (top-right of the browser chrome)
- The green toast reading `✓ Cache cleared for this site (N fresh)` in the page's top-right corner
- No DevTools visible, no other extensions cluttering the toolbar

### 2. All four modes — `02-modes-1280x800.png`

**Composition:** shows the right-click menu open on the toolbar icon, revealing all six entries.

**Steps:**

1. Navigate to a clean page (a simple blog post, doc page, or localhost app).
2. **Right-click** the ClearCache toolbar icon. A context menu appears with these entries:
   - Clear cache for this site & reload
   - Clear cache for ALL sites & reload
   - Clear cache + cookies + storage for this site & reload
   - Clear cache & reload all tabs in this window
   - Clear cache & reload all tabs in ALL windows
   - Deep clear & reopen this page in a new incognito window
3. Capture with the menu open.

**What the shot should show:** a readable context menu that lists every mode, giving the viewer a sense of the extension's full surface.

### 3. Keyboard shortcuts — `03-shortcuts-1280x800.png`

**Composition:** the `chrome://extensions/shortcuts` page zoomed to show ClearCache's four bindings.

**Steps:**

1. Navigate to `chrome://extensions/shortcuts`.
2. Scroll so the **ClearCache** block is vertically centered.
3. The four commands should be visible:
   - Clear cache for this site & reload — `Alt+Shift+R`
   - Clear cache for ALL sites & reload current tab — `Alt+Shift+A`
   - Clear cache + cookies + storage for this site & reload — `Alt+Shift+D`
   - Clear cache for current site & reload all tabs in this window — `Alt+Shift+W`
   - Clear cache for current site & reload all tabs in ALL windows — (unbound)
4. Capture.

**What the shot should show:** that the extension ships with sensible default shortcuts and that the user can customize them.

### 4. Privacy/transparency — `04-privacy-1280x800.png`

**Composition:** the `chrome://extensions` page with ClearCache's details visible, highlighting the permissions list and the "This extension collected data is described by the developer as: None" line.

**Steps:**

1. Navigate to `chrome://extensions`.
2. Click **Details** on the ClearCache card.
3. Scroll to show: permissions, site access, and the "data handling" section.
4. Capture.

**What the shot should show:** that the permissions are few and well-justified, and that no data collection is declared. Reinforces the privacy pitch in the listing copy.

### 5. (Optional) Deep-clear warning toast — `05-deep-1280x800.png`

**Composition:** same as the hero, but with the **red** `☠` deep-clear toast.

**Steps:**

1. Navigate to a site where you're logged in (anywhere — Gmail, GitHub, your app).
2. Press `Alt+Shift+D` to trigger the deep clear.
3. The page reloads; you're now logged out.
4. The red toast appears: `☠ Cache, cookies & storage cleared for this site`.
5. Capture.

Only include this one if you have room (Chrome accepts up to 5 screenshots, Edge up to 6). It helps sell the "we have a nuclear option when you need it" point.

---

## After capture

1. Put the PNG files here in `docs/screenshots/` using the filenames above.
2. Also copy them into `store/` (they're needed for both the store uploads and the README).
3. The [README.md](../../README.md) already references these filenames — once they exist, the embedded images on GitHub will render automatically.
4. Upload to the store forms in this order:
   - Hero first (it becomes the default gallery thumbnail)
   - All-four-modes
   - Keyboard shortcuts
   - Privacy
   - (optional) deep-clear

## Common rejection reasons to avoid

- **Screenshot at wrong dimensions** — must be exactly 1280×800. DevTools device mode guarantees this.
- **Unrelated web content in the background** — don't capture with Gmail, Twitter, or any content that distracts. Use a generic blog post or a dev dashboard.
- **Extension icon not pinned** — reviewers want to see where the user clicks.
- **Dev console visible** — close DevTools before capturing (easy to forget since you'll be using device mode to size; use its "close DevTools" button after sizing, then capture via OS tools, OR use device mode's own capture button).
- **Visible personal data** — cookie values, usernames, emails. Use a fresh profile for the capture session.
- **Dark mode screenshots in a light-mode listing** — pick one, match it throughout the set.

## When to re-capture

- When you ship a feature that visibly changes the UI (new mode, new toast color, redesigned icon, etc.).
- When Chrome ships a major toolbar redesign that makes existing shots look dated.
- When store reviewers flag something specific.

These files are committed to the repo (not auto-built) — change them in the same PR as the feature that affects them.
