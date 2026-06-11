const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  const ss = (name) => page.screenshot({ path: `/tmp/hanomi-verify/${name}.png`, fullPage: false });

  // 1. Dashboard
  await page.goto('http://localhost:3000');
  await page.waitForSelector('text=Good morning', { timeout: 8000 });
  await ss('01-dashboard');
  console.log('01 dashboard loaded');

  // 2. Click Generate Drawing
  const genBtn = page.locator('button:has-text("Generate Drawing")').first();
  await genBtn.click();
  await page.waitForSelector('text=Upload CAD Model', { timeout: 5000 });
  await ss('02-upload');
  console.log('02 upload screen');

  // 3. Use Demo CAD
  const demoBtn = page.locator('button:has-text("Use Demo CAD")');
  await demoBtn.click();
  await page.waitForSelector('text=File verified', { timeout: 5000 });
  await ss('03-upload-verified');
  console.log('03 file verified');

  // 4. Begin AI Analysis
  const analyzeBtn = page.locator('button:has-text("Begin AI Analysis")');
  await analyzeBtn.click();
  await page.waitForSelector('text=AI Feature Detection', { timeout: 5000 });
  await ss('04-analysis-start');
  console.log('04 analysis started');

  // Wait for analysis to complete (~3.5s)
  await page.waitForSelector('text=Analysis complete', { timeout: 8000 });
  await ss('05-analysis-done');
  console.log('05 analysis complete');

  // 5. Generate Drawing
  const generateBtn = page.locator('button:has-text("Generate 2D Drawing")');
  await generateBtn.click();
  await page.waitForSelector('text=2D Manufacturing Drawing', { timeout: 5000 });
  await ss('06-generating-start');
  console.log('06 generating started');

  // Wait for 100%
  await page.waitForSelector('text=100%', { timeout: 15000 });
  await ss('07-generating-done');
  console.log('07 generating at 100%');

  // 6. Apply GD&T
  const gdtBtn = page.locator('button:has-text("Apply GD&T")');
  await gdtBtn.click();
  await page.waitForSelector('text=Applying GD&T', { timeout: 5000 });
  await ss('08-gdt-start');
  console.log('08 gdt started');

  await page.waitForSelector('text=ISO 1101 validated', { timeout: 8000 });
  await ss('09-gdt-done');
  console.log('09 gdt done');

  // 7. Quality Review
  const qualityBtn = page.locator('button:has-text("Run Quality Review")');
  await qualityBtn.click();
  await page.waitForSelector('text=Manufacturing Readiness', { timeout: 5000 });
  await page.waitForTimeout(1200); // let score animate
  await ss('10-quality');
  console.log('10 quality review');

  // 8. Final Result
  const resultBtn = page.locator('button:has-text("View Final Drawing")');
  await resultBtn.click();
  await page.waitForSelector('text=Drawing Complete', { timeout: 5000 });
  await ss('11-result');
  console.log('11 final result loaded');

  // Check export buttons visible
  const exportPDF = page.locator('button:has-text("Export PDF")');
  const exportDWG = page.locator('button:has-text("Export DWG")');
  const exportDXF = page.locator('button:has-text("Export DXF")');
  const exportNative = page.locator('button:has-text("Export Native CAD")');
  const share = page.locator('button:has-text("Share")');

  for (const [name, loc] of [
    ['Export PDF', exportPDF], ['Export DWG', exportDWG],
    ['Export DXF', exportDXF], ['Export Native CAD', exportNative],
    ['Share', share]
  ]) {
    const vis = await loc.isVisible();
    console.log(`  ${name}: ${vis ? '✓' : '✗'}`);
  }

  // Click Export PDF to test loading state
  await exportPDF.click();
  await page.waitForTimeout(300);
  const preparingVisible = await page.locator('text=Preparing').isVisible();
  console.log(`  Export PDF loading state: ${preparingVisible ? '✓' : '✗'}`);
  await ss('12-export-click');

  // 9. New Drawing button resets
  await page.waitForTimeout(2000);
  const newDrawingBtn = page.locator('button:has-text("New Drawing")');
  const newVisible = await newDrawingBtn.isVisible();
  console.log(`  New Drawing button: ${newVisible ? '✓' : '✗'}`);

  await browser.close();
  console.log('\nAll steps complete.');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
