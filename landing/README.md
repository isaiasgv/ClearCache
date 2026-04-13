# Landing page

Single-file static site for the public ClearCache landing page. Designed to be hosted on **Cloudflare Pages** (or any other static host).

## Files

| File           | Purpose                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| `index.html`   | The whole site. Embedded CSS, no JavaScript, no external font requests.  |
| `logo.png`     | 128px logo (copied from `../icons/icon128.png`).                         |
| `favicon.png`  | Same image, served as the favicon.                                       |
| `_headers`     | Cloudflare Pages headers file — sets CSP, frame-ancestors, etc.          |

## Deploy on Cloudflare Pages

1. In the Cloudflare dashboard, create a new Pages project and connect it to this GitHub repo.
2. **Production branch:** `main` (so the site only updates when a stable release lands).
3. **Build settings:**
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `landing`
   - **Root directory:** *(leave empty — defaults to repo root)*
4. Save & deploy. Cloudflare will publish the contents of `landing/` to `<project>.pages.dev`.
5. Add a custom domain in the Pages project settings if you want, e.g. `clearcache.example.com`.

## Local preview

```bash
# From the repo root, any of:
python -m http.server 8000 -d landing
# or
npx http-server landing -p 8000
# or
cd landing && python -m http.server 8000
```

Then visit http://localhost:8000.

## Updating

This is intentionally **not** auto-generated from `README.md`. The two have different audiences:

- **`README.md`** is for developers landing on the GitHub repo.
- **`landing/index.html`** is for end users landing from a search engine or store listing.

Update both when you ship a feature with public-facing copy. Keep the landing copy slightly less technical than the README.

## Asset sync

If you replace the icons in `../icons/`, refresh the landing copies:

```bash
cp ../icons/icon128.png logo.png
cp ../icons/icon128.png favicon.png
```

(Consider committing a smaller dedicated logo if `icon128.png` ever grows beyond a few KB.)

## What it does NOT have

- No JavaScript. No analytics. No tracking pixels. No third-party fonts.
- No build step. Edit `index.html` and push.
- No service worker. The page is meant to be cached by the browser the normal way.
