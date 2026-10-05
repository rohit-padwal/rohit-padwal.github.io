import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';

test('direct clean project route, refresh, and back navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/projects/solidity-grammer-fuzzer');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Solidity-Grammer-Fuzzer');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Solidity-Grammer-Fuzzer');
  await page.getByRole('link', { name: '← Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/#portfolio$/);
  await expect(page.locator('#portfolio')).toBeInViewport();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Solidity-Grammer-Fuzzer');
  expect(errors).toEqual([]);
});

test('actual custom 404 redirects before React, preserving query strings and fragments', async ({ page }) => {
  const responses: number[] = [];
  const errors: string[] = [];
  page.on('response', (response) => { if (response.request().isNavigationRequest()) responses.push(response.status()); });
  page.on('pageerror', (error) => errors.push(error.message));
  const path = '/projects/solidity-grammer-fuzzer?test-fallback=1&tag=a%26b&extra=one#details';
  await page.goto(path);
  await expect(page).toHaveURL(`http://127.0.0.1:4175${path}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Solidity-Grammer-Fuzzer');
  expect(responses).toContain(404);
  expect(responses).toContain(200);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Solidity-Grammer-Fuzzer');
  expect(errors).toEqual([]);
});

test('Markdown blog direct link, refresh, metadata and drafts', async ({ page }) => {
  await page.goto('/blog/route-verification?test-fallback=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Routing verification fixture');
  await expect(page.getByRole('heading', { name: 'Test section' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.locator('pre')).toContainText('const testOnly = true');
  await expect(page).toHaveTitle('Routing verification fixture | Rohit Padwal');
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', '2026-10-03');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://rohit-padwal.com/blog/route-verification');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Routing verification fixture');
  await page.getByRole('link', { name: '← Blog', exact: true }).click();
  await expect(page.locator('meta[property="article:published_time"]')).toHaveCount(0);
  await expect(page.locator('meta[property="article:tag"]')).toHaveCount(0);
  await expect(page.getByText('Unpublished test draft')).toHaveCount(0);
  const $ = load(readFileSync('.test-dist/blog/route-verification/index.html', 'utf8'));
  expect($('h1').text()).toBe('Routing verification fixture');
  expect($('meta[property="og:title"]').attr('content')).toBe('Routing verification fixture | Rohit Padwal');
  expect(readFileSync('.test-dist/sitemap.xml', 'utf8')).not.toContain('unpublished');
});

for (const [name, width, height] of [['mobile', 390, 844], ['tablet', 820, 1180], ['desktop', 1440, 1000]] as const) {
  test(`${name}: no overflow, accessible homepage, loaded images and keyboard navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('#hero h1')).toContainText('Rohit');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty('complete', true);
      expect(await img.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
    }
    for (const group of await page.locator('[data-reveal]').all()) {
      await group.scrollIntoViewIfNeeded();
      await expect(group).toHaveAttribute('data-reveal-state', 'visible');
      await expect.poll(() => group.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
    }
    await expect(page.locator('[data-reveal-state="pending"]')).toHaveCount(0);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    const outline = await page.getByRole('link', { name: 'Skip to content' }).evaluate((node) => getComputedStyle(node).outlineWidth);
    expect(parseFloat(outline)).toBeGreaterThan(0);
    if (width < 1280) {
      await page.getByRole('button', { name: 'Menu' }).click();
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
      await page.getByRole('button', { name: 'Menu' }).click();
      await page.getByRole('navigation').getByRole('link', { name: 'Education', exact: true }).click();
      await expect(page.locator('#education')).toBeInViewport();
      await expect(page.getByRole('navigation')).toBeHidden();
    }
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.screenshot({ path: `test-results/${name}-home.png`, fullPage: true });
    await page.screenshot({ path: `test-results/${name}-hero.png` });
  });
}

async function fillForm(page: import('@playwright/test').Page) {
  await page.getByLabel('Your Name', { exact: true }).fill('Test sender');
  await page.getByLabel('Your Email', { exact: true }).fill('sender@example.com');
  await page.getByLabel('Subject', { exact: true }).fill('Test subject');
  await page.getByLabel('Message', { exact: true }).fill('Test message');
}

test('contact validation, sending state and success are visible', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByText('Your Name is required.')).toBeVisible();
  await expect(page.getByLabel('Your Name')).toBeFocused();
  await fillForm(page);
  await page.getByLabel('Your Email').fill('invalid');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await page.getByLabel('Your Email').fill('sender@example.com');
  let release: () => void = () => {};
  const submitted = new Promise<void>((resolve) => { release = resolve; });
  await page.route('https://formspree.io/f/testendpoint', async (route) => {
    const request = route.request();
    expect(request.method()).toBe('POST');
    expect(request.headers()['accept']).toBe('application/json');
    expect(request.postData()).toContain('Test message');
    await submitted;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('button', { name: 'Loading' })).toBeDisabled();
  release();
  await expect(page.getByRole('status')).toContainText('Your message has been sent. Thank you!');
  await expect(page.getByLabel('Your Name')).toHaveValue('');
});

test('header targets and spacing stay balanced at intermediate and large widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 640, 1024, 1279, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width < 1280) {
      await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
      await page.getByRole('button', { name: 'Menu' }).click();
    }
    const links = page.getByRole('navigation').getByRole('link');
    await expect(links).toHaveCount(9);
    for (const link of await links.all()) {
      const size = await link.evaluate((element) => ({ font: parseFloat(getComputedStyle(element).fontSize), height: element.getBoundingClientRect().height }));
      expect(size.font).toBeGreaterThanOrEqual(16);
      expect(size.height).toBeGreaterThanOrEqual(48);
    }
    if (width >= 1280) {
      const brand = await page.getByRole('link', { name: 'Rohit Padwal — Home', exact: true }).boundingBox();
      const first = await links.first().boundingBox();
      const last = await links.last().boundingBox();
      expect(first!.x - (brand!.x + brand!.width)).toBeLessThanOrEqual(32);
      expect(last!.x + last!.width).toBeLessThanOrEqual(width - 19);
    }
  }
});

test('scroll reveals work once and keyboard focus reveals offscreen controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const projectGroup = page.locator('#portfolio [data-reveal]').last();
  await expect(projectGroup).toHaveAttribute('data-reveal-state', 'pending');
  await projectGroup.scrollIntoViewIfNeeded();
  await expect(projectGroup).toHaveAttribute('data-reveal-state', 'visible');
  await expect.poll(() => projectGroup.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  await page.locator('#hero').scrollIntoViewIfNeeded();
  await expect(projectGroup).toHaveAttribute('data-reveal-state', 'visible');
  // A keyboard user can tab to an offscreen form without waiting for a reveal.
  await page.getByLabel('Your Name').focus();
  await expect(page.locator('#contact [data-reveal]').last()).toHaveAttribute('data-reveal-state', 'visible');
});

test('reduced motion and no JavaScript keep every section visible', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-reveal-state="pending"]')).toHaveCount(0);
  expect(await page.locator('#hero h1').evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  const card = page.locator('#portfolio article').first();
  await card.hover();
  expect(await card.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s');
  expect(await card.evaluate((element) => getComputedStyle(element).transform)).toBe('none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('[data-reveal-state="pending"]').first()).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-reveal-state="pending"]')).toHaveCount(0);
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const snapshot = await noJs.newPage();
  await snapshot.goto('http://127.0.0.1:4176/');
  await expect(snapshot.locator('#portfolio h2')).toHaveText('Projects');
  await expect(snapshot.locator('#contact form')).toBeVisible();
  expect(await snapshot.locator('#portfolio article').first().evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  await noJs.close();
});

test('contact service errors and network failures preserve entered values', async ({ page }) => {
  await page.goto('/#contact');
  await fillForm(page);
  await page.route('https://formspree.io/f/testendpoint', (route) => route.fulfill({ status: 422, contentType: 'application/json', body: '{"errors":[{"message":"Please try again."}]}' }));
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('status')).toContainText('Please try again.');
  await expect(page.getByLabel('Your Name')).toHaveValue('Test sender');
  await page.unroute('https://formspree.io/f/testendpoint');
  await page.route('https://formspree.io/f/testendpoint', (route) => route.abort('failed'));
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('status')).toContainText('Unable to send your message.');
});

test('unknown URLs show a real not-found page and noindex metadata', async ({ page }) => {
  await page.goto('/blog/does-not-exist');
  await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
});

test('production has no fixture posts and the unconfigured form gives an email fallback', async ({ page }) => {
  await page.goto('http://127.0.0.1:4176/blog');
  await expect(page.getByRole('heading', { name: 'No posts yet.' })).toBeVisible();
  await expect(page.getByText('Routing verification fixture')).toHaveCount(0);
  await page.goto('http://127.0.0.1:4176/#contact');
  await expect(page.getByText('The contact form is not connected yet.', { exact: false })).toBeVisible();
  await fillForm(page);
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('status')).toContainText('Please email rohitpadwal.uta@gmail.com.');
  await expect(page.getByLabel('Your Name')).toHaveValue('Test sender');
});
