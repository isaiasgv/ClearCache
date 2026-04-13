#!/usr/bin/env node
// Render the store asset HTML sources to PNG at exact pixel dimensions using
// headless Chrome or Edge. No npm dependencies — uses whichever Chromium
// browser is already installed on the machine.
//
// Usage (from repo root):
//   node store/build-assets.mjs
//
// Override the browser binary by setting CHROMIUM env var, e.g.:
//   CHROMIUM="/path/to/chrome" node store/build-assets.mjs

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { platform } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(__dirname, "src");
const OUT_DIR = __dirname;

const ASSETS = [
  { src: "extension-logo.html", out: "extension-logo-300x300.png",     w: 300,  h: 300 },
  { src: "small-tile.html",     out: "small-promo-tile-440x280.png",   w: 440,  h: 280 },
  { src: "large-tile.html",     out: "large-promo-tile-1400x560.png",  w: 1400, h: 560 }
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

function render(browser, srcAbs, outAbs, w, h) {
  const url = pathToFileURL(srcAbs).href;
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--default-background-color=00000000",
    "--no-sandbox",
    `--window-size=${w},${h}`,
    "--virtual-time-budget=2000",
    `--screenshot=${outAbs}`,
    url
  ];
  const res = spawnSync(browser, args, { stdio: ["ignore", "pipe", "pipe"] });
  return res.status === 0;
}

const browser = findBrowser();
if (!browser) {
  console.error(
    "Could not find Chrome, Edge, Brave, or Chromium.\n" +
    "Install one of them, or set CHROMIUM=/path/to/browser and re-run."
  );
  process.exit(1);
}
console.log(`Using browser: ${browser}\n`);

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

let failed = 0;
for (const a of ASSETS) {
  const srcAbs = resolve(SRC_DIR, a.src);
  const outAbs = resolve(OUT_DIR, a.out);
  if (!existsSync(srcAbs)) {
    console.warn(`[skip] ${a.src} (source not found)`);
    continue;
  }
  process.stdout.write(`[render] ${a.src.padEnd(24)} → ${a.out.padEnd(34)} (${a.w}×${a.h}) ... `);
  const ok = render(browser, srcAbs, outAbs, a.w, a.h);
  console.log(ok ? "ok" : "FAILED");
  if (!ok) failed++;
}

if (failed > 0) {
  console.error(`\n${failed} asset(s) failed to render.`);
  process.exit(1);
}
console.log("\nAll assets rendered to store/");
console.log("Ready to upload to the Microsoft Edge Add-ons and Chrome Web Store listings.");
