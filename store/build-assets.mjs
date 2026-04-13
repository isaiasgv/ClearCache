#!/usr/bin/env node
// Render all PNG assets (extension icons, landing logo/favicon, store
// promo tiles) from the HTML sources under store/src/ using headless
// Chrome/Edge/Brave via puppeteer-core (devDependency).
//
// We use puppeteer instead of `chrome --screenshot` because Chrome's CLI
// screenshot mode enforces a minimum window width (~484px) on Windows,
// which breaks rendering for small icons (16/32/48/128 px). Puppeteer's
// CDP-based page.screenshot honors exact viewport dimensions at any size.
//
// Usage (from repo root):
//   node store/build-assets.mjs
//
// Override the browser binary by setting CHROMIUM env var:
//   CHROMIUM="/path/to/chrome" node store/build-assets.mjs

import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { platform } from "node:os";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const SRC_DIR   = resolve(__dirname, "src");

// Each asset renders one HTML source at specific pixel dimensions to an output PNG.
// `icon-square.html` is used at multiple sizes for all square icons.
const ASSETS = [
  // Extension icons (shipped in the zip, referenced by manifest.json)
  { src: "icon-square.html", out: "icons/icon16.png",                    w: 16,   h: 16   },
  { src: "icon-square.html", out: "icons/icon32.png",                    w: 32,   h: 32   },
  { src: "icon-square.html", out: "icons/icon48.png",                    w: 48,   h: 48   },
  { src: "icon-square.html", out: "icons/icon128.png",                   w: 128,  h: 128  },

  // Landing page assets (served by Cloudflare Pages)
  { src: "icon-square.html", out: "landing/favicon.png",                 w: 128,  h: 128  },
  { src: "icon-square.html", out: "landing/logo.png",                    w: 300,  h: 300  },

  // Chrome Web Store / Edge Add-ons listing assets
  { src: "icon-square.html", out: "store/extension-logo-300x300.png",    w: 300,  h: 300  },
  { src: "small-tile.html",  out: "store/small-promo-tile-440x280.png",  w: 440,  h: 280  },
  { src: "large-tile.html",  out: "store/large-promo-tile-1400x560.png", w: 1400, h: 560  }
];

function findBrowser() {
  if (process.env.CHROMIUM && existsSync(process.env.CHROMIUM)) return process.env.CHROMIUM;

  const candidates = [];
  if (platform() === "win32") {
    candidates.push(
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
    );
  } else if (platform() === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
      "/Applications/Chromium.app/Contents/MacOS/Chromium"
    );
  } else {
    candidates.push(
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/usr/bin/microsoft-edge",
      "/usr/bin/brave-browser"
    );
  }
  return candidates.filter(Boolean).find((p) => existsSync(p));
}

const executablePath = findBrowser();
if (!executablePath) {
  console.error(
    "Could not find Chrome, Edge, Brave, or Chromium.\n" +
    "Install one of them, or set CHROMIUM=/path/to/browser and re-run."
  );
  process.exit(1);
}
console.log(`Using browser: ${executablePath}\n`);

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: null
});

let failed = 0;
try {
  for (const a of ASSETS) {
    const srcAbs = resolve(SRC_DIR, a.src);
    const outAbs = resolve(REPO_ROOT, a.out);
    if (!existsSync(srcAbs)) {
      console.warn(`[skip]   ${a.src} (source not found)`);
      continue;
    }
    const outDir = dirname(outAbs);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    process.stdout.write(`[render] ${a.out.padEnd(44)} (${a.w}×${a.h}) ... `);
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: 1 });
      await page.goto(pathToFileURL(srcAbs).href, { waitUntil: "networkidle0", timeout: 10000 });
      // Give CSS transitions / font rendering a moment to settle.
      await new Promise((r) => setTimeout(r, 150));
      await page.screenshot({
        path: outAbs,
        type: "png",
        omitBackground: true,
        clip: { x: 0, y: 0, width: a.w, height: a.h }
      });
      await page.close();
      console.log("ok");
    } catch (err) {
      console.log("FAILED");
      console.error("  ", err.message);
      failed++;
    }
  }
} finally {
  await browser.close();
}

if (failed > 0) {
  console.error(`\n${failed} asset(s) failed to render.`);
  process.exit(1);
}
console.log("\nAll PNG assets rendered.");
console.log("Extension icons, landing page assets, and store promo tiles are now consistent.");
