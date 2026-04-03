const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();

/**
 * POST /api/browser-login
 * Uses Playwright with system Chrome to log into the college site.
 * Cloudflare Turnstile auto-verifies since we run on the college's actual domain.
 */
router.post('/browser-login', async (req, res) => {
  const { username, password = 'Kmit123$' } = req.body;

  if (!username) {
    return res.status(400).json({ success: 0, error: 'username is required' });
  }

  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome', // use system Chrome, not bundled Chromium
      headless: true,
      args: ['--disable-blink-features=AutomationControlled'],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    });

    const page = await context.newPage();

    // Remove webdriver marker
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    // Intercept the auth response to capture the token
    let capturedToken = null;
    let capturedRefresh = null;
    let loginError = null;

    page.on('response', async (response) => {
      if (response.url().includes('/auth/login')) {
        try {
          const body = await response.json();
          if (body.Error === false) {
            capturedToken = body.access_token || body.token;
            capturedRefresh = body.refresh_token;
          } else {
            loginError = body.message || 'Authentication failed';
          }
        } catch (_) {}
      }
    });

    await page.goto('https://kmit.teleuniv.in/netra', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Fill credentials
    await page.waitForSelector('input[placeholder*="Mobile"], input[type="tel"]', { timeout: 10000 });
    await page.fill('input[placeholder*="Mobile"], input[type="tel"]', username);
    await page.fill('input[type="password"]', password);

    // Wait for Turnstile to silently verify
    await page.waitForTimeout(10000);

    // Click Sign In
    const btn = await page.$('button[type="submit"]') ||
      await page.locator('button', { hasText: /sign\s*in|login/i }).first();
    if (btn) {
      await btn.click();
    } else {
      return res.status(500).json({ success: 0, error: 'Sign In button not found' });
    }

    // Wait for auth response (up to 20s)
    const deadline = Date.now() + 20000;
    while (!capturedToken && !loginError && Date.now() < deadline) {
      await page.waitForTimeout(500);
    }

    if (capturedToken) {
      return res.json({ success: 1, token: capturedToken, refresh_token: capturedRefresh });
    }

    return res.status(401).json({
      success: 0,
      error: loginError || 'Login timed out — Turnstile may have challenged',
    });

  } catch (err) {
    console.error('[browser-login] error:', err.message);
    return res.status(500).json({ success: 0, error: 'Browser login failed: ' + err.message });
  } finally {
    if (browser) await browser.close();
  }
});

module.exports = router;
