// Run with: node tests/study-prototype.cjs (requires Playwright + Chromium).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const os = require('node:os');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox', '--no-zygote', '--single-process', '--disable-gpu'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
  await page.getByRole('tab', { name: 'Styles', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab', { name: 'Screens', exact: true }).getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('[data-resource]:enabled').count(), 0);
  assert.equal(await page.locator('#study-board').isDisabled(), true);
  for (const subject of ['Biology', 'Chemistry', 'Maths']) {
    await page.getByLabel('Subject', { exact: true }).selectOption(subject);
    assert.equal(await page.locator('[data-resource]:enabled').count(), 0);
    for (const board of ['AQA', 'Edexcel', 'OCR']) {
      await page.getByLabel('Exam board', { exact: true }).selectOption(board);
      const buttons = page.locator('[data-resource]:enabled');
      assert.equal(await buttons.count(), 3);
      for (const button of await buttons.all()) {
        await button.focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('#resource-preview').evaluate(el => el === document.activeElement), true);
        assert.equal(await page.locator('#resource-context').textContent(), `${subject} · ${board}`);
        assert.match(await page.locator('#resource-title').textContent(), /not available/);
        assert.equal(await page.locator('[data-resource][aria-pressed="true"]').count(), 1);
      }
    }
  }
  await page.getByRole('tab', { name: 'Screens', exact: true }).focus();
  await page.keyboard.press('End');
  assert.equal(await page.getByRole('tab', { name: 'Lock', exact: true }).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowDown');
  await page.locator('[data-resource]:enabled').first().focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('#resource-preview').evaluate(el => el === document.activeElement), true);
  await page.getByLabel('Subject', { exact: true }).selectOption('');
  assert.equal(await page.locator('#study-board').isDisabled(), true);
  assert.equal(await page.locator('[aria-pressed="true"]').count(), 0);
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const tab of ['Styles', 'Screens', 'Flows', 'Lock']) {
      await page.getByRole('tab', { name: tab, exact: true }).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${tab} overflows at ${width}`);
    }
  }
  await page.getByRole('tab', { name: 'Screens', exact: true }).click();
  await page.getByLabel('Subject', { exact: true }).selectOption('Biology');
  await page.getByLabel('Exam board', { exact: true }).selectOption('AQA');
  await page.getByRole('button', { name: 'Biology: Past papers', exact: true }).click();
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.screenshot({ path: path.join(os.tmpdir(), 'sprava-mobile.png'), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.screenshot({ path: path.join(os.tmpdir(), 'sprava-desktop.png'), fullPage: true });
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('Passed: 27 subject/board/resource combinations, keyboard activation and focus, selection reset, four tabs at five viewport widths, no browser errors.');
})().catch(error => { console.error(error); process.exitCode = 1; });
