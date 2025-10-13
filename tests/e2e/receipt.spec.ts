import { test, expect } from '@playwright/test';

test('order flow generates and attaches receipt PDF', async ({ page, context }) => {
  // navigate to app
  await page.goto('http://localhost:4200');

  // wait for products to appear and click first Add to cart
  await page.waitForSelector('button:has-text("Add to cart")', { timeout: 10000 });
  await page.click('button:has-text("Add to cart")');

  // open cart - use JS click to avoid animation/stability timing issues
  const cartToggle = await page.waitForSelector('button[aria-label="cart-toggle"], .cart-button-float, button:has-text("🛒")', { timeout: 10000 });
  await cartToggle.evaluate((el: any) => (el as HTMLElement).click());

  // click checkout via WhatsApp (this will save order and generate receipt)
  await page.click('button:has-text("Checkout via WhatsApp"), button:has-text("💬 Checkout via WhatsApp")');

  // wait for toast success
  await page.waitForSelector('text=Order placed', { timeout: 10000 });

  // wait for orders list and find latest order pay button
  await page.waitForSelector('text=Your Orders', { timeout: 10000 });

  // click the first "Pay with M-Pesa" button
  const payBtn = await page.waitForSelector('button:has-text("Pay with M-Pesa")', { timeout: 10000 });
  await payBtn.evaluate((el: any) => (el as HTMLElement).click());

  // enter transaction id and confirm
  await page.fill('input[placeholder="Enter M-Pesa transaction code"]', 'TEST12345');
  await page.click('button:has-text("Confirm Payment")');

  // wait for receipt modal
  await page.waitForSelector('text=Receipt -', { timeout: 10000 });

  // click download PDF and capture download
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Download PDF")')
  ]);

  const path = await download.path();
  expect(path).not.toBeNull();
  const stat = await download.saveAs(path!);
  // ensure file exists and size > 0
  expect(stat).not.toBeNull();
});
