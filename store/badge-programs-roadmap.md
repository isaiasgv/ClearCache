# Store badge & curation programs — roadmap

Each of the four stores we publish to has its own way of recognizing "high-quality" extensions. This file tracks what each program looks like, whether ClearCache can realistically get it, and what concrete action (if any) we can take.

Status as of v0.0.8, 2026-04-15. Revisit every couple of months.

---

## At a glance

| Store | Badge / program | Earnable? | Mechanism | Next action |
|---|---|---|---|---|
| Microsoft Edge | Featured Badge | ✅ | Automated evaluation | Wait — let signals accrue on the live v0.0.8 listing |
| Chrome Web Store | Featured collection | ⚠️ (editorial) | Google editors curate | Request review once we have reviews/installs |
| Chrome Web Store | Established Publisher | ✅ | 3+ months + identity verification | **Start identity verification now** |
| Firefox AMO | Recommended Extensions | ✅ | Manual Mozilla review against criteria | **Nominate after ~2 months live on AMO** |
| Opera Add-ons | No formal program | ❌ | Editorial featured shelf only | None — hope for organic pickup |

---

## 1. Microsoft Edge Featured Badge

**What it is:** a small "Featured" badge next to the extension name on the Edge Add-ons listing. Tooltip reads *"This extension follows all of Microsoft's recommended practices and has been verified."*

**How it's awarded:** automated internal evaluation against [Best practices for extensions](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/best-practices). No application, no appeal, no published cadence.

**Compliance status:** see [edge-featured-badge-compliance.md](./edge-featured-badge-compliance.md). Zero gaps identified at the last audit.

**Can be revoked:** yes — if review sentiment drops, store listing goes stale, or performance metrics regress.

### Action plan

1. Confirm v0.0.8 is live on the Edge Add-ons listing at [microsoftedge.microsoft.com](https://microsoftedge.microsoft.com/).
2. Maintain regular update cadence (automated by the release workflow — nothing to do).
3. Check the listing weekly for badge appearance. No notification is sent.
4. If badge doesn't appear within ~3 months of first install signals, revisit `edge-featured-badge-compliance.md` for any newly-added Microsoft criteria.

---

## 2. Chrome Web Store — Featured collection (editorial)

**What it is:** Placement in one of the Chrome Web Store's themed homepage collections (e.g. "Editor's Picks", "Featured this week"). **Not a badge on the listing itself** — it's a prominent featured slot.

**How it's awarded:** Google editors manually pick submissions. No automated bar. Install count and rating average matter heavily for eligibility.

**Compliance status:** Strong position — we're developer-friendly, privacy-first, minimal, open source. These are the things Google editors tend to spotlight.

### Action plan

1. Wait until v0.0.8 is live on the Chrome Web Store with at least a few hundred installs and a rating above 4.0 average.
2. Submit for editorial consideration via the [Chrome Web Store developer feedback form](https://support.google.com/chrome_webstore/contact/developer_support). Explain the positioning: dev-tool utility, MV3-native, zero-dependencies, zero-telemetry, open source, 20-language localization. That combination is rare and fits Chrome's "trustworthy extensions" messaging well.
3. No guaranteed response — treat it as a low-cost nomination with high upside.

---

## 3. Chrome Web Store — Established Publisher badge

**What it is:** A blue checkmark next to the developer name on every one of your extension listings. Signals to users "this publisher is a legitimate long-standing developer."

**How it's awarded:** Automatic once all conditions are met:
- Developer account has been **active for 3+ months** with at least one published extension.
- Developer identity has been **verified** through the Chrome Web Store's identity verification process.
- No policy violations or enforcement actions on the account.

**Docs:** https://developer.chrome.com/docs/webstore/verify-publisher

### Action plan — do this now

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → **Account** → **Verify your identity** (or similar, link text varies over time).
2. Submit the requested identity documents. Typically a government-issued ID + possibly a phone verification. Process takes 1–2 weeks.
3. Mark the calendar 3 months from the date v0.0.8 (or whichever is the first stable version) went live on the Chrome Web Store. Around that date, the checkmark should appear automatically next to the publisher name.
4. After that, all future extensions published from the same developer account inherit the checkmark on day one.

**Why this is worth doing:** this is the **most visible trust signal** on Chrome and it's fully self-service. No editorial decision. Nothing to hope for — just paperwork and patience.

---

## 4. Firefox AMO — Recommended Extensions program

**What it is:** A green shield icon with "Recommended" next to the extension name on the addons.mozilla.org listing. Mozilla also promotes Recommended extensions in their own editorial channels (about:addons page, blog posts, etc.). Recommended extensions bypass some of AMO's stricter review constraints on future updates.

**How it's awarded:** Mozilla staff manually review nominated extensions against explicit published criteria:
- Clear value to the user
- Minimal, well-justified permissions
- Privacy-respecting (doesn't collect or transmit user data)
- Stable and maintained (regular updates)
- Works correctly across tested scenarios
- Clean code, no obfuscation
- Good listing copy + screenshots
- At least ~2 months of history on AMO before nomination

**Docs:** https://extensionworkshop.com/documentation/publish/recommended-extensions/

**ClearCache fit against the criteria:** Excellent. Our entire positioning is exactly what Mozilla rewards — zero data collection, five focused modes, ~420 lines of auditable code, GPL-3.0, 20-language UI, strong privacy policy. The only gate is time-on-store.

### Action plan

1. Get v0.0.8 (Firefox zip) accepted and live on AMO.
2. Wait approximately 2 months. Accumulate user reviews, fix any reported issues, maintain update cadence.
3. Nominate via the email address or form on the [Recommended Extensions page](https://extensionworkshop.com/documentation/publish/recommended-extensions/) (Mozilla changes this URL occasionally — follow the current link).
4. In the nomination, lean on:
   - **Zero data collection** (machine-readable via `data_collection_permissions: ["none"]` in the manifest)
   - **20-language UI** — rare among single-maintainer extensions
   - **Firefox-specific engineering** — `lib/browser-compat.js` + runtime branch for Firefox's distinct `browsingData` API surface, documented in the privacy policy
   - **Open source + reproducible builds** — the full build recipe is in `store/firefox-amo-answers.md`
5. Response time is typically a few weeks. Rejection comes with specific feedback; acceptance is silent — the badge just appears on the listing.

---

## 5. Opera Add-ons — no formal badge program

Opera does not run a public Featured/Recommended badge program comparable to the other three stores. The closest analogue is their homepage "featured" shelf, which is editorially curated with no public criteria or application process.

**Action:** Nothing proactive. Maintain the listing, ship updates, hope for organic pickup. If Opera's editorial team reaches out for a promotional opportunity, say yes.

---

## Maintenance

Re-evaluate this roadmap:

- After each stable release (every month or two).
- If any of the four stores publishes a new badge or curation program.
- If our extension crosses a meaningful install threshold on any store (10k, 50k, 100k).
- If a badge is awarded OR revoked — update the row in the "At a glance" table.

## Status log

| Date | Store | Event | Notes |
|---|---|---|---|
| 2026-04-15 | — | Roadmap created | v0.0.8 about to be listed on all four stores |
