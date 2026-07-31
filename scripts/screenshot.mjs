// Capture real app screenshots for the hackathon submission evidence.
// Usage: node scripts/screenshot.mjs [viewport]
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:3000";
const OUT = "Screenshots";

const shots = [
  { path: "home", url: "/home" },
  { path: "app", url: "/app" },
  { path: "history", url: "/history" },
  { path: "guide", url: "/guide" },
];

const mobile = { name: "Mobile", viewport: { width: 390, height: 844 } };
const desktop = { name: "Desktop", viewport: { width: 1440, height: 900 } };

const targets = process.argv[2] === "desktop" ? [desktop] : [mobile, desktop];

const browser = await chromium.launch();
for (const t of targets) {
  const ctx = await browser.newContext({ viewport: t.viewport });
  const page = await ctx.newPage();
  for (const s of shots) {
    await page.goto(`${BASE}${s.url}`, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1200);
    // Allow scroll-reveal animations to settle.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    const file = `${OUT}/${t.name} ${s.path}.png`;
    await page.screenshot({ path: file, fullPage: false });
    console.log(`saved ${file}`);
  }
  await ctx.close();
}
await browser.close();
console.log("done");
