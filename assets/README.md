# /assets/

Canonical, stable location for ClearCache's logo and social-preview imagery. External apps (Slack, Dokploy, container registries, docs sites) should fetch from here via the GitHub raw URL pattern below.

| File                  | Dimensions | Source                                                     |
| --------------------- | ---------- | ---------------------------------------------------------- |
| `logo.svg`            | vector     | Hand-authored — see [../store/src/_logo.svg](../store/src/_logo.svg) |
| `logo.png`            | 512×512    | Rendered from `store/src/icon-square.html` by [../store/build-assets.mjs](../store/build-assets.mjs) |
| `social-preview.png`  | 1280×640   | Rendered from `store/src/social-preview.html` by [../store/build-assets.mjs](../store/build-assets.mjs) |

## Stable raw URLs

```
https://raw.githubusercontent.com/isaiasgv/ClearCache/main/assets/logo.svg
https://raw.githubusercontent.com/isaiasgv/ClearCache/main/assets/logo.png
https://raw.githubusercontent.com/isaiasgv/ClearCache/main/assets/social-preview.png
```

These resolve against the `main` branch — the stable mirror of what's published. Use these URLs in any external integration that needs the brand mark.

## Regenerating

The PNGs are generated, not hand-edited. To rebuild after changing the SVG or the HTML templates under [../store/src/](../store/src/):

```bash
node store/build-assets.mjs
```

This rebuilds **every** PNG in the repo (extension icons, landing assets, store promo tiles, and these `/assets/` files) from the same SVG glyph, keeping them visually consistent.

## GitHub social preview

`social-preview.png` is the 1280×640 image GitHub displays when the repo is shared on Slack, X, Discord, etc. GitHub has no API for setting it — upload manually at:

**Settings → Social preview** → https://github.com/isaiasgv/ClearCache/settings
