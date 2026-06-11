const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  const ss = (name) => page.screenshot({ path: `/tmp/hanomi-verify/${name}.png` });

  // 1. Dashboard
  await page.goto('http://localhost:3000');
  await page.waitForSelector('text=Good morning', { timeout: 8000 });
  await ss('01-dashboard');
  console.log('01 dashboard loaded ✓');

  // 2. Click Generate Drawing
  await page.locator('button:has-text("Generate Drawing")').first().click();
  await page.waitForSelector('text=Upload CAD Model', { timeout: 5000 });
  await ss('02-upload');
  console.log('02 upload screen ✓');

  // 3. Use Demo CAD
  await page.locator('button:has-text("Use Demo CAD")').click();
  await page.waitForSelector('text=File verified', { timeout: 5000 });
  await ss('03-verified');
  console.log('03 file verified ✓');

  // 4. Begin AI Analysis
  await page.locator('button:has-text("Begin AI Analysis")').click();
  await page.waitForSelector('text=AI Feature Detection', { timeout: 5000 });
  await ss('04-analysis');
  console.log('04 analysis started ✓');

  await page.waitForSelector('text=Analysis complete', { timeout: 8000 });
  await ss('05-analysis-done');
  console.log('05 analysis complete ✓');

  // 5. Generate Drawing
  await page.locator('button:has-text("Generate 2D Drawing")').click();
  await page.waitForSelector('text=2D Manufacturing Drawing', { timeout: 5000 });
  await ss('06-generating');
  console.log('06 generating started ✓');

  await page.waitForSelector('text=100%', { timeout: 15000 });
  await ss('07-generating-100');
  console.log('07 generating 100% ✓');

  // 6. GD&T
  await page.locator('button:has-text("Apply GD&T")').click();
  await page.waitForSelector('text=Applying GD&T', { timeout: 5000 });
  await ss('08-gdt');
  console.log('08 gdt started ✓');

  await page.waitForSelector('text=ISO 1101 validated', { timeout: 8000 });
  await ss('09-gdt-done');
  console.log('09 gdt done ✓');

  // 7. Quality
  await page.locator('button:has-text("Run Quality Review")').click();
  await page.waitForSelector('text=Manufacturing Readiness', { timeout: 5000 });
  await page.waitForTimeout(1500);
  await ss('10-quality');
  console.log('10 quality ✓');

  // 8. Final Result
  await page.locator('button:has-text("View Final Drawing")').click();
  await page.waitForSelector('text=Drawing Complete', { timeout: 5000 });
  await ss('11-result');
  console.log('11 result ✓');

  // Check export buttons
  for (const label of ['Export PDF', 'Export DWG', 'Export DXF', 'Export Native CAD', 'Share']) {
    const v = await page.locator(`button:has-text("${label}")`).isVisible();
    console.log(`   ${label}: ${v ? '✓' : '✗'}`);
  }

  // Test export click → loading state
  await page.locator('button:has-text("Export PDF")').click();
  await page.waitForTimeout(200);
  const preparing = await page.locator('text=Preparing').isVisible();
  console.log(`   Export loading state: ${preparing ? '✓' : '✗'}`);
  await ss('12-export');

  // Test X close
  await page.waitForTimeout(2000);
  await page.locator('button:has-text("New Drawing")').click();
  const backOnUpload = await page.locator('text=Upload CAD Model').isVisible();
  console.log(`   New Drawing resets to upload: ${backOnUpload ? '✓' : '✗'}`);

  await browser.close();
  console.log('\nAll steps complete.');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
// separate probe for "New Drawing" strict-mode issue
