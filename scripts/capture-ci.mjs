// Capture a screenshot of the GitHub Actions CI/CD run page as submission evidence.
// Usage: node scripts/capture-ci.mjs
import { chromium } from "playwright";

const RUN_URL =
  "https://github.com/a-man00/StellarBridge/actions/runs/30561561294";
const OUT = "Screenshots/CI Pipeline.png";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 860 },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
});
const page = await ctx.newPage();

await page.goto(RUN_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(6000);

// If GitHub threw a login wall, surface it instead of saving a useless shot.
const hasLoginWall = await page
  .getByText("Sign in to GitHub", { exact: true })
  .first()
  .isVisible()
  .catch(() => false);

if (hasLoginWall) {
  console.error("GitHub login wall detected — cannot capture Actions page.");
  process.exit(1);
}

// Wait for the check-run summary to render.
await page
  .getByText("All checks have passed", { exact: false })
  .first()
  .waitFor({ timeout: 30000 })
  .catch(() => {});
await page.waitForTimeout(2500);

await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1280, height: 900 } });
console.log(`saved ${OUT}`);
await browser.close();
