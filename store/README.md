# Store assets

Promotional and listing assets for the Chrome Web Store, Microsoft Edge Add-ons, Opera Add-ons, and Firefox Add-ons (AMO).

## Submission answer docs

Canonical, copy-pasteable answers for every store form are kept alongside this README. Reuse them verbatim on resubmission and for new stores.

| Store | Doc | Covers |
|---|---|---|
| Chrome Web Store | [chrome-webstore-answers.md](./chrome-webstore-answers.md) | Single purpose, permission justifications, remote code, data usage, privacy practices form |
| Microsoft Edge Add-ons | [edge-addons-answers.md](./edge-addons-answers.md) | Same form as Chrome plus Edge-specific listing fields (search terms, age rating) |
| Opera Add-ons | [opera-addons-answers.md](./opera-addons-answers.md) | General tab (URLs, build instructions, EULA, privacy policy) + Translations tab |
| Firefox Add-ons (AMO) | [firefox-amo-answers.md](./firefox-amo-answers.md) | Name, summary, description, categories, license, privacy policy, Reviewer Notes |

## Localization — UI vs store listing copy

These are **two different layers** and it's important not to confuse them:

| Layer | What it is | Where it lives | Current coverage |
|---|---|---|---|
| **In-extension UI** | Menu titles, toast text, badge tooltips, command descriptions — what the user sees *inside the browser* | [`_locales/<code>/messages.json`](../_locales/) | **20 locales**: en, es, de, fr, it, nl, pl, pt_BR, ru, tr, ja, ko, zh_CN, zh_TW, vi, id, th, he, ar, fa |
| **Store listing copy** | Short description, full description, screenshots' captions — what the user sees *on the store page before installing* | Paste-only during submission; canonical versions further down in this file | **8 locales** below (en, es, zh_CN, ja, de, fr, pt_BR, it) — covers ~70% of global store traffic |

The 20-locale UI coverage is the priority. Store listing copy can be added in more languages over time as needed — every new listing locale is a separate upload in each store's dashboard.

---

## What's here

**None of the generated PNG/zip files are bundled into the extension zip** — the release workflow only packages `manifest.json`, `background.js`, `LICENSE`, `icons/`, `_locales/`, and `lib/`.

### Generated (promotional tiles + logo)

The HTML sources live in [`src/`](src/). Run the build script to render them to PNG at exact pixel dimensions:

```bash
node store/build-assets.mjs
```

The script auto-detects an installed Chrome, Edge, Brave, or Chromium and uses it in headless mode — no npm dependencies. Override with `CHROMIUM=/path/to/browser node store/build-assets.mjs`.

| Generated file                          | Dimensions | Used by          |
| --------------------------------------- | ---------- | ---------------- |
| `extension-logo-64x64.png`              | 64×64      | Opera Add-ons (small icon), generic favicon-sized listing slots |
| `extension-logo-300x300.png`            | 300×300    | Edge Add-ons (required), Chrome Web Store (icon field) |
| `small-promo-tile-440x280.png`          | 440×280    | Chrome Web Store (required), Edge Add-ons (small promo tile) |
| `large-promo-tile-1400x560.png`         | 1400×560   | Chrome Web Store (marquee, optional — only if Google features the listing), Edge Add-ons (large promo tile, optional) |
| `opera-promo-tile-300x188.png`          | 300×188    | Opera Add-ons (optional promotional image — used if the site editors feature the extension) |

Re-run the build any time you edit files under [`src/`](src/) or the logo in [`src/_logo.svg`](src/_logo.svg).

### Captured (screenshots)

Screenshots of the extension in action are **captured manually, not generated**, because the stores require them to represent real extension behavior. See [`docs/screenshots/CAPTURE_GUIDE.md`](../docs/screenshots/CAPTURE_GUIDE.md) for the exact shot list, dimensions (1280×800), and capture steps.

Store the captured PNGs in [`docs/screenshots/`](../docs/screenshots/) and copy them into this folder before uploading to the store dashboards.

## Upload order (applies to all four stores)

1. `extension-logo-300x300.png` → Extension logo field
2. `small-promo-tile-440x280.png` → Small promotional tile field
3. `large-promo-tile-1400x560.png` → Large promotional tile field (optional)
4. `extension-logo-64x64.png` → Opera only (small icon slot)
5. `opera-promo-tile-300x188.png` → Opera only (promotional image)
6. Screenshots → Screenshots section (upload the hero shot first so it becomes the default thumbnail)
7. Firefox AMO ships the Firefox-specific zip — no promo tiles required, only screenshots and the 300×300 icon

## Privacy policy URL

Link to:

- The rendered landing page's privacy section once you've deployed the Cloudflare Pages site (e.g. `https://clearcache.yourdomain.com#privacy`), **or**
- The raw GitHub URL for [`docs/privacy.md`](../docs/privacy.md)

All four stores accept either. A hosted first-party URL is slightly preferred by reviewers.

---

## Search terms

Edge Add-ons allows up to 7 terms per locale, 30 characters each, max 21 words total. Chrome Web Store and Firefox AMO don't have a dedicated search terms field — they index the description. Opera Add-ons doesn't surface search terms in its UI.

Below: search terms for each locale that has full listing copy. Add more locales as needed — the format is just seven short search phrases.

### English (`en`)

| # | Term                    |
|---|-------------------------|
| 1 | clear cache             |
| 2 | hard reload             |
| 3 | force refresh           |
| 4 | refresh cache           |
| 5 | reload page             |
| 6 | clear browser cache     |
| 7 | DevTools                |

### Spanish (`es`)

| # | Term                    |
|---|-------------------------|
| 1 | limpiar caché           |
| 2 | recarga forzada         |
| 3 | forzar recarga          |
| 4 | actualizar caché        |
| 5 | recargar página         |
| 6 | borrar caché navegador  |
| 7 | DevTools                |

### Chinese Simplified (`zh_CN`)

| # | Term                    |
|---|-------------------------|
| 1 | 清除缓存                |
| 2 | 强制刷新                |
| 3 | 硬刷新                  |
| 4 | 清理浏览器缓存          |
| 5 | 刷新页面                |
| 6 | 重新加载                |
| 7 | DevTools                |

### Japanese (`ja`)

| # | Term                    |
|---|-------------------------|
| 1 | キャッシュクリア        |
| 2 | ハードリロード          |
| 3 | 強制リロード            |
| 4 | キャッシュ削除          |
| 5 | ブラウザキャッシュ      |
| 6 | 再読み込み              |
| 7 | DevTools                |

### German (`de`)

| # | Term                    |
|---|-------------------------|
| 1 | Cache leeren            |
| 2 | Hard Reload             |
| 3 | Cache löschen           |
| 4 | Seite neu laden         |
| 5 | Browser Cache           |
| 6 | Cache bereinigen        |
| 7 | DevTools                |

### French (`fr`)

| # | Term                    |
|---|-------------------------|
| 1 | vider cache             |
| 2 | rechargement forcé      |
| 3 | actualiser cache        |
| 4 | vider cache navigateur  |
| 5 | recharger page          |
| 6 | effacer cache           |
| 7 | DevTools                |

### Portuguese BR (`pt_BR`)

| # | Term                    |
|---|-------------------------|
| 1 | limpar cache            |
| 2 | recarga forçada         |
| 3 | atualizar cache         |
| 4 | limpar cache navegador  |
| 5 | recarregar página       |
| 6 | forçar recarga          |
| 7 | DevTools                |

### Italian (`it`)

| # | Term                    |
|---|-------------------------|
| 1 | svuota cache            |
| 2 | ricarica forzata        |
| 3 | aggiorna cache          |
| 4 | svuota cache browser    |
| 5 | ricarica pagina         |
| 6 | cancella cache          |
| 7 | DevTools                |

---

## Store listing copy

All stores accept plain text (Chrome strips Markdown). Cap each paragraph at ~500 chars for readability in the listing's truncated preview.

Short description is capped at 132 chars by Chrome/Edge. AMO summary caps at 250 chars.

### English (`en`)

**Short description:**

> One-click per-site cache clear and hard-reload. Five modes, 20 languages, zero telemetry, open source GPL-3.0.

**Full description:**

```
A minimal, zero-dependency browser extension for Chrome, Edge, and Firefox that clears the cache for the current site and hard-reloads it — in one click, with no settings to configure and no data leaving your browser.

When you need a bigger hammer, keyboard shortcuts and a right-click menu give you subdomain-wide, all-sites, and deep-clear modes too.

No popups. No options page. No telemetry. No remote calls. Vanilla ES2022 JavaScript.

Features:
• Per-site cache clear by default — other sites' data stays untouched
• Five clear modes: this site, this site + open subdomains, all sites, deep clear (cache + cookies + storage), reload all tabs
• Keyboard shortcuts: Alt+Shift+R / S / A / D / W (customizable via chrome://extensions/shortcuts)
• Post-reload toast with cache hit/miss telemetry so you can verify the wipe worked
• Right-click context menu with all modes including "reopen in incognito" and "open link with fresh cache"
• Available in 20 languages: English, Spanish, French, German, Italian, Dutch, Polish, Portuguese-BR, Russian, Turkish, Japanese, Korean, Chinese Simplified and Traditional, Vietnamese, Indonesian, Thai, Hebrew, Arabic, Persian
• Manifest V3, open source (GPL-3.0), zero dependencies
```

### Spanish (`es`)

**Short description:**

> Limpia la caché del sitio actual y recarga con un clic. Cinco modos, 20 idiomas, cero telemetría, código abierto GPL-3.0.

**Full description:**

```
Una extensión mínima para Chrome, Edge y Firefox que limpia la caché del sitio actual y fuerza una recarga — en un solo clic, sin configuración y sin que ningún dato salga de tu navegador.

Cuando necesitas algo más fuerte, atajos de teclado y un menú contextual te dan modos de subdominios, todos los sitios y limpieza profunda.

Sin popups. Sin página de opciones. Sin telemetría. Sin llamadas remotas. JavaScript ES2022 vanilla.

Características:
• Limpieza de caché por sitio — los datos de otros sitios no se tocan
• Cinco modos: sitio actual, sitio + subdominios abiertos, todos los sitios, limpieza profunda (caché + cookies + almacenamiento), recargar todas las pestañas
• Atajos de teclado: Alt+Shift+R / S / A / D / W (personalizables en chrome://extensions/shortcuts)
• Toast post-recarga con telemetría de caché para verificar que la limpieza funcionó
• Menú contextual con todos los modos incluyendo "reabrir en incógnito" y "abrir enlace con caché limpia"
• Disponible en 20 idiomas: inglés, español, francés, alemán, italiano, neerlandés, polaco, portugués (BR), ruso, turco, japonés, coreano, chino simplificado y tradicional, vietnamita, indonesio, tailandés, hebreo, árabe, persa
• Manifest V3, código abierto (GPL-3.0), cero dependencias
```

### Chinese Simplified (`zh_CN`)

**Short description:**

> 一键清除当前站点缓存并强制刷新。五种模式，20 种语言，零遥测，GPL-3.0 开源。

**Full description:**

```
一款极简、零依赖的浏览器扩展，适用于 Chrome、Edge 和 Firefox。一键清除当前站点的缓存并强制刷新 — 无需配置，数据不离开浏览器。

需要更强力的清理时，键盘快捷键和右键菜单还提供子域名范围、所有站点和深度清理模式。

无弹窗。无选项页面。无遥测。无远程调用。原生 ES2022 JavaScript。

功能：
• 默认按站点清除缓存 — 其他站点的数据不受影响
• 五种清除模式：此站点、此站点 + 打开的子域名、所有站点、深度清理（缓存 + Cookie + 存储）、重新加载所有标签页
• 键盘快捷键：Alt+Shift+R / S / A / D / W（可在 chrome://extensions/shortcuts 中自定义）
• 重新加载后的通知，显示缓存命中/未命中遥测，以验证清理是否生效
• 右键菜单包含所有模式，包括"在隐身模式中重新打开"和"使用新缓存打开链接"
• 支持 20 种语言：英语、西班牙语、法语、德语、意大利语、荷兰语、波兰语、葡萄牙语（巴西）、俄语、土耳其语、日语、韩语、简体中文、繁体中文、越南语、印尼语、泰语、希伯来语、阿拉伯语、波斯语
• Manifest V3，开源（GPL-3.0），零依赖
```

### Japanese (`ja`)

**Short description:**

> ワンクリックで現在のサイトのキャッシュをクリアしてハードリロード。5つのモード、20言語、テレメトリーなし、GPL-3.0 オープンソース。

**Full description:**

```
Chrome、Edge、Firefox 向けのミニマルで依存関係ゼロのブラウザ拡張機能。現在のサイトのキャッシュをクリアしてハードリロードします — ワンクリックで、設定不要、ブラウザからデータが外に出ることはありません。

より強力なクリアが必要な場合、キーボードショートカットと右クリックメニューでサブドメイン全体、全サイト、ディープクリアモードも利用できます。

ポップアップなし。オプションページなし。テレメトリーなし。リモート呼び出しなし。Vanilla ES2022 JavaScript。

機能：
• デフォルトでサイト単位のキャッシュクリア — 他のサイトのデータには触れません
• 5つのクリアモード：このサイト、このサイト + 開いているサブドメイン、全サイト、ディープクリア（キャッシュ + Cookie + ストレージ）、すべてのタブをリロード
• キーボードショートカット：Alt+Shift+R / S / A / D / W（chrome://extensions/shortcuts でカスタマイズ可能）
• リロード後のトーストにキャッシュヒット/ミスのテレメトリーを表示、クリアが機能したか確認できます
• 右クリックメニューですべてのモードが利用可能。「シークレットモードで再度開く」と「新しいキャッシュでリンクを開く」を含みます
• 20言語対応：英語、スペイン語、フランス語、ドイツ語、イタリア語、オランダ語、ポーランド語、ポルトガル語（ブラジル）、ロシア語、トルコ語、日本語、韓国語、簡体字中国語、繁体字中国語、ベトナム語、インドネシア語、タイ語、ヘブライ語、アラビア語、ペルシア語
• Manifest V3、オープンソース（GPL-3.0）、依存関係ゼロ
```

### German (`de`)

**Short description:**

> Mit einem Klick den Cache der aktuellen Seite leeren und hart neu laden. Fünf Modi, 20 Sprachen, keine Telemetrie, Open Source GPL-3.0.

**Full description:**

```
Eine minimalistische Browser-Erweiterung ohne Abhängigkeiten für Chrome, Edge und Firefox, die den Cache der aktuellen Seite leert und einen Hard Reload auslöst — mit einem Klick, ohne Einstellungen, und ohne dass Daten den Browser verlassen.

Für härtere Fälle bieten Tastaturkürzel und ein Rechtsklick-Menü zusätzlich Modi für Subdomains, alle Seiten und vollständige Bereinigung.

Keine Popups. Keine Optionsseite. Keine Telemetrie. Keine Remote-Aufrufe. Vanilla ES2022 JavaScript.

Funktionen:
• Cache-Löschung pro Seite standardmäßig — Daten anderer Seiten bleiben unberührt
• Fünf Löschmodi: diese Seite, diese Seite + offene Subdomains, alle Seiten, vollständige Bereinigung (Cache + Cookies + Speicher), alle Tabs neu laden
• Tastaturkürzel: Alt+Umschalt+R / S / A / D / W (anpassbar unter chrome://extensions/shortcuts)
• Toast nach dem Neuladen mit Cache-Hit/Miss-Telemetrie zur Überprüfung
• Rechtsklick-Menü mit allen Modi einschließlich "Im Inkognito-Modus erneut öffnen" und "Link mit frischem Cache öffnen"
• Verfügbar in 20 Sprachen: Englisch, Spanisch, Französisch, Deutsch, Italienisch, Niederländisch, Polnisch, Portugiesisch (Brasilien), Russisch, Türkisch, Japanisch, Koreanisch, Chinesisch Vereinfacht und Traditionell, Vietnamesisch, Indonesisch, Thai, Hebräisch, Arabisch, Persisch
• Manifest V3, Open Source (GPL-3.0), null Abhängigkeiten
```

### French (`fr`)

**Short description:**

> Vider le cache du site actuel et forcer le rechargement en un clic. Cinq modes, 20 langues, aucune télémétrie, open source GPL-3.0.

**Full description:**

```
Une extension de navigateur minimaliste sans dépendances pour Chrome, Edge et Firefox qui vide le cache du site actuel et force un rechargement — en un seul clic, sans configuration, et sans qu'aucune donnée ne sorte de votre navigateur.

Lorsqu'il faut frapper plus fort, les raccourcis clavier et le menu contextuel offrent aussi des modes sous-domaines, tous sites et nettoyage complet.

Aucune popup. Aucune page d'options. Aucune télémétrie. Aucun appel distant. JavaScript ES2022 vanilla.

Fonctionnalités :
• Vidage du cache par site par défaut — les données des autres sites ne sont pas touchées
• Cinq modes de vidage : ce site, ce site + sous-domaines ouverts, tous les sites, nettoyage complet (cache + cookies + stockage), recharger tous les onglets
• Raccourcis clavier : Alt+Maj+R / S / A / D / W (personnalisables via chrome://extensions/shortcuts)
• Notification post-rechargement avec télémétrie cache hit/miss pour vérifier que le nettoyage a fonctionné
• Menu contextuel avec tous les modes, incluant « Rouvrir en navigation privée » et « Ouvrir le lien avec un cache neuf »
• Disponible en 20 langues : anglais, espagnol, français, allemand, italien, néerlandais, polonais, portugais (Brésil), russe, turc, japonais, coréen, chinois simplifié et traditionnel, vietnamien, indonésien, thaï, hébreu, arabe, persan
• Manifest V3, open source (GPL-3.0), zéro dépendance
```

### Portuguese BR (`pt_BR`)

**Short description:**

> Limpe o cache do site atual e recarregue com um clique. Cinco modos, 20 idiomas, zero telemetria, código aberto GPL-3.0.

**Full description:**

```
Uma extensão de navegador mínima e sem dependências para Chrome, Edge e Firefox que limpa o cache do site atual e força o recarregamento — com um clique, sem configurações, e sem que nenhum dado saia do seu navegador.

Quando precisa de algo mais forte, atalhos de teclado e um menu de contexto oferecem modos de subdomínios, todos os sites e limpeza profunda.

Sem popups. Sem página de opções. Sem telemetria. Sem chamadas remotas. JavaScript ES2022 vanilla.

Recursos:
• Limpeza de cache por site por padrão — os dados de outros sites não são tocados
• Cinco modos de limpeza: este site, este site + subdomínios abertos, todos os sites, limpeza profunda (cache + cookies + armazenamento), recarregar todas as abas
• Atalhos de teclado: Alt+Shift+R / S / A / D / W (personalizáveis em chrome://extensions/shortcuts)
• Notificação pós-recarregamento com telemetria de cache hit/miss para verificar se a limpeza funcionou
• Menu de contexto com todos os modos, incluindo "Reabrir em janela anônima" e "Abrir link com cache limpo"
• Disponível em 20 idiomas: inglês, espanhol, francês, alemão, italiano, neerlandês, polonês, português (BR), russo, turco, japonês, coreano, chinês simplificado e tradicional, vietnamita, indonésio, tailandês, hebraico, árabe, persa
• Manifest V3, código aberto (GPL-3.0), zero dependências
```

### Italian (`it`)

**Short description:**

> Svuota la cache del sito corrente e ricarica con un clic. Cinque modalità, 20 lingue, zero telemetria, open source GPL-3.0.

**Full description:**

```
Un'estensione del browser minima e senza dipendenze per Chrome, Edge e Firefox che svuota la cache del sito corrente e forza il ricaricamento — con un clic, senza configurazioni e senza che alcun dato lasci il tuo browser.

Quando serve qualcosa di più forte, scorciatoie da tastiera e un menu contestuale offrono modalità per sottodomini, tutti i siti e pulizia completa.

Nessun popup. Nessuna pagina di opzioni. Nessuna telemetria. Nessuna chiamata remota. JavaScript ES2022 vanilla.

Caratteristiche:
• Pulizia cache per sito per impostazione predefinita — i dati degli altri siti non vengono toccati
• Cinque modalità di pulizia: questo sito, questo sito + sottodomini aperti, tutti i siti, pulizia profonda (cache + cookie + archiviazione), ricarica tutte le schede
• Scorciatoie da tastiera: Alt+Maiusc+R / S / A / D / W (personalizzabili da chrome://extensions/shortcuts)
• Notifica post-ricaricamento con telemetria cache hit/miss per verificare che la pulizia abbia funzionato
• Menu contestuale con tutte le modalità, incluso "Riapri in finestra in incognito" e "Apri link con cache pulita"
• Disponibile in 20 lingue: inglese, spagnolo, francese, tedesco, italiano, olandese, polacco, portoghese (BR), russo, turco, giapponese, coreano, cinese semplificato e tradizionale, vietnamita, indonesiano, thailandese, ebraico, arabo, persiano
• Manifest V3, open source (GPL-3.0), zero dipendenze
```

---

## Certification notes (Edge / Chrome reviewer field)

Paste this into the "Notes for certification" textarea when submitting. Reviewers see it; users don't.

```
No accounts, logins, or API keys needed. The extension works immediately after install.

Testing steps:
1. Pin the extension icon to the toolbar.
2. Navigate to any website (e.g. https://example.com).
3. Click the toolbar icon — the page reloads and a green toast appears in the top-right confirming the cache was cleared.
4. Right-click the toolbar icon to see all seven modes (per-site, per-site + subdomains, all-sites, deep clear, reload all tabs in window, reload all tabs in all windows, reopen in incognito).
5. Press Alt+Shift+R to test the keyboard shortcut (same as clicking the icon).
6. Press Alt+Shift+S to clear the current site and every open subdomain of it (e.g. www.example.com + api.example.com + docs.example.com).
7. Press Alt+Shift+D on a site where you're logged in — cookies and storage are cleared, the page reloads, and you're logged out.
8. Right-click any hyperlink on any page → "Open link with fresh cache" clears the link's origin then opens it in a new tab.

No hidden features, no remote services, no dependencies on other products. The entire extension is one service worker (~420 lines of vanilla ES2022) that calls chrome.browsingData.remove and chrome.tabs.reload.

Permissions justification:
- browsingData: clear cache, Cache Storage, Service Workers, cookies, localStorage, IndexedDB
- tabs: read the active tab's URL for per-site scoping + reload; enumerate open tabs for the subdomain-clear mode
- contextMenus: right-click menu on the toolbar icon AND on any hyperlink
- scripting: inject the confirmation toast into the reloaded page
- webRequest: read-only observation of post-reload requests for cache hit/miss telemetry in the toast
- <all_urls>: required for per-site cache scoping to work on any origin

Firefox-specific notes:
- background uses "scripts" + "type: module" (Firefox does not support MV3 service_worker)
- strict_min_version 112.0 because "background.type" requires Firefox 112+
- browser_specific_settings.gecko.data_collection_permissions is { required: ["none"] } — truthful zero-data-collection declaration
- browsingData.remove filters dataTypes to strip cacheStorage + serviceWorkers (Firefox does not accept those keys); see lib/browser-compat.js

Localization:
- UI ships in 20 locales under _locales/
- Store listing copy in this submission language is in store/README.md

Source code: https://github.com/isaiasgv/ClearCache
```

## Do NOT commit these

The generated PNGs in this folder should **not** be committed — re-running the build any time is cheap and they'd bloat the repo. The `.gitignore` at the repo root excludes them. The HTML sources under [`src/`](src/) and the build script ARE committed.
