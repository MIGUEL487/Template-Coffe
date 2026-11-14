import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:4173";
const output = process.env.QA_OUTPUT || resolve("qa-output");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(base);
  await page.locator('[data-motion-ready="true"]').waitFor();
  const audit = await page.evaluate(async () => {
    const urls = [
      ...new Set(
        [
          ...document.querySelectorAll(
            ".counter-pick img, .cutout-frame img, .mobile-ritual-img, .site-header .wordmark img, .hero-image",
          ),
        ].map((img) => img.src),
      ),
    ];
    const result = [];
    for (const src of urls) {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0,
        foreground = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
        if (pixels[i] > 200) foreground++;
      }
      result.push({
        file: new URL(src).pathname,
        transparentPixels: transparent,
        foregroundPixels: foreground,
        total: canvas.width * canvas.height,
        png: new URL(src).pathname.endsWith(".png"),
      });
    }
    return result;
  });
  for (const item of audit) {
    assert.equal(item.png, true, item.file);
    assert.ok(item.transparentPixels > item.total * 0.1, item.file + " transparency");
    assert.ok(item.foregroundPixels > item.total * 0.02, item.file + " visible subject");
  }
  await page.locator("#favorites").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  const position = () =>
    page.locator(".counter-feature-float").evaluate((el) => getComputedStyle(el).transform);
  const before = await position();
  await page.waitForTimeout(600);
  const after = await position();
  assert.notEqual(before, after, "Counter floating is active");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  const reducedA = await position();
  await page.waitForTimeout(600);
  const reducedB = await position();
  assert.equal(reducedA, reducedB, "Counter stops for reduced motion");
  await mkdir(output, { recursive: true });
  const result = { audit, float: "active", reducedMotion: "stopped" };
  await writeFile(`${output}/cutout-audit.json`, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
