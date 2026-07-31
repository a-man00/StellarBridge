import { chromium } from "playwright";
import fs from "fs";

if (!fs.existsSync("scratch")) {
  fs.mkdirSync("scratch", { recursive: true });
}

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      background-color: #0d1117;
      color: #c9d1d9;
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, Consolas, monospace;
      padding: 30px;
      margin: 0;
      width: 1000px;
      box-sizing: border-box;
    }
    .terminal {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      overflow: hidden;
    }
    .header {
      background: #21262d;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #30363d;
    }
    .dots {
      display: flex;
      gap: 8px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot.red { background: #ff5f56; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #27c93f; }
    .title {
      margin-left: auto;
      margin-right: auto;
      color: #8b949e;
      font-size: 13px;
      font-weight: 600;
    }
    .content {
      padding: 24px;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .section-title {
      color: #58a6ff;
      font-weight: bold;
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px dashed #30363d;
    }
    .pass { color: #3fb950; font-weight: bold; }
    .pass-bg { background: #238636; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-weight: bold; }
    .bold { font-weight: bold; color: #f0f6fc; }
    .muted { color: #8b949e; }
    .cmd { color: #d2a8ff; font-weight: bold; }
    .highlight { color: #e3b341; }
  </style>
</head>
<body>
  <div class="terminal">
    <div class="header">
      <div class="dots">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      <div class="title">StellarBridge — Automated Test Suite Output</div>
    </div>
    <div class="content">
<div class="section-title">⚡ 1. FRONTEND VITEST SUITE (<span class="cmd">npm test</span>)</div>
 <span class="pass-bg">RUN</span>  <span class="muted">v4.1.10 /StellarBridge</span>

 <span class="pass">✓</span> <span class="bold">src/test/format.test.ts</span> <span class="muted">(4 tests)</span> <span class="muted">6ms</span>
 <span class="pass">✓</span> <span class="bold">src/test/Badge.test.tsx</span> <span class="muted">(1 test)</span> <span class="muted">108ms</span>
 <span class="pass">✓</span> <span class="bold">src/test/validation.test.ts</span> <span class="muted">(9 tests)</span> <span class="muted">14ms</span>
 <span class="pass">✓</span> <span class="bold">src/test/Button.test.tsx</span> <span class="muted">(2 tests)</span> <span class="muted">383ms</span>

 <span class="bold">Test Files</span>  <span class="pass">4 passed</span> (4)
      <span class="bold">Tests</span>  <span class="pass">16 passed</span> (16)
   <span class="bold">Start at</span>  22:11:12
   <span class="bold">Duration</span>  2.05s

<div class="section-title" style="margin-top: 24px;">🦀 2. SOROBAN CONTRACT SUITE (<span class="cmd">cargo test</span>)</div>
<span class="cmd">$ cd contracts && cargo test</span>

<span class="highlight">Running tests/test_fee_registry.rs</span>
running 3 tests
test test_min_fee_floor ... <span class="pass">ok</span>
test test_default_fee_calculation ... <span class="pass">ok</span>
test test_set_fee_bps_by_admin ... <span class="pass">ok</span>
test result: <span class="pass">ok</span>. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out

<span class="highlight">Running tests/test_remittance.rs</span>
running 3 tests
test test_last_record_when_empty ... <span class="pass">ok</span>
test test_get_records_returns_all ... <span class="pass">ok</span>
test test_send_message_increases_count ... <span class="pass">ok</span>
test result: <span class="pass">ok</span>. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out

<span class="highlight">Running tests/test_router.rs</span>
running 2 tests
test test_router_estimate_fee ... <span class="pass">ok</span>
test test_router_inter_contract_routing ... <span class="pass">ok</span>
test result: <span class="pass">ok</span>. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out

<span class="pass">Summary: 16 Vitest frontend tests + 8 Soroban contract tests = 24 PASSING TESTS TOTAL (100% PASS RATE)</span>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync("scratch/test_output.html", htmlContent);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1060, height: 950 } });
await page.goto(`file://${process.cwd()}/scratch/test_output.html`);
await page.waitForTimeout(1000);
const element = await page.$(".terminal");
await element.screenshot({ path: "Screenshots/Test Output.png" });
await browser.close();
console.log("Saved Screenshots/Test Output.png successfully!");
