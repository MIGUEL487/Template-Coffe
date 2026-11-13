import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const output = process.env.QA_OUTPUT || resolve("qa-output");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
const errors = [];
try {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    console.log("Checking width", width);
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push({ width, error: `HTTP ${r.status()} ${r.url()}` });
    });
    page.on("pageerror", (e) => errors.push({ width, error: e.message }));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push({ width, error: msg.text() });
    });
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    await page.locator('.lolo-site[data-ready="true"][data-motion-ready="true"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(
      () =>
        Number(getComputedStyle(document.querySelector(".hero-copy .hero-buttons")).opacity) === 1,
    );
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    assert.equal(overflow, false, `Horizontal overflow at ${width}`);
    await page.screenshot({ path: `${output}/hero-${width}.png` });
    await page.getByRole("button", { name: "Next drink", exact: true }).click();
    await page.waitForFunction(
      () => document.querySelector(".counter-details h3").textContent === "Iced Mocha Glass",
    );
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Add to Order", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor({ state: "visible" });
    assert.match(await dialog.innerText(), /Demo only — no order will be sent/);
    assert.equal(
      await dialog.getByRole("button", { name: "Pickup ordering unavailable" }).isDisabled(),
      true,
    );
    await dialog.getByRole("button", { name: "Increase Iced Mocha Glass" }).click();
    assert.equal(await dialog.locator("output").innerText(), "2");
    // Native dialog contains keyboard focus and closes with Escape.
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.querySelector("dialog").contains(document.activeElement)),
      true,
    );
    await page.keyboard.press("Escape");
    assert.equal(await dialog.isVisible(), false);
    await page.reload();
    await page.getByRole("button", { name: "Open pickup bag, 2 items" }).waitFor();
    await page.getByRole("button", { name: "Open pickup bag, 2 items" }).click();
    assert.equal(await dialog.locator("output").innerText(), "2");
    await dialog.getByRole("button", { name: "Decrease Iced Mocha Glass" }).click();
    await dialog.getByRole("button", { name: "Decrease Iced Mocha Glass" }).click();
    assert.match(await dialog.innerText(), /Your bag is empty/);
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => localStorage.getItem("lolo_active_pickup_order")), null);
    // Scroll the actual page to load all photos, exercise reversible reveals, and verify nav state.
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
    });
    for (const id of ["favorites", "ritual", "atmosphere", "visit"]) {
      await page.evaluate(
        (id) => window.scrollTo(0, document.getElementById(id).offsetTop - 110),
        id,
      );
      await page.waitForTimeout(400);
      assert.equal(
        await page.locator(`.main-nav a[href="#${id}"]`).getAttribute("aria-current"),
        "location",
        `Nav ${id} at ${width}`,
      );
    }
    if (width === 375 || width === 1440) {
      for (const selector of ["#favorites", ".food-section", "#ritual", "#atmosphere", "#visit"]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForTimeout(1100);
        await page.screenshot({
          path: `${output}/section-${selector.replace(/[#.]/g, "")}-${width}.png`,
        });
      }
    }
    for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 700) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(400);
    const broken = await page
      .locator("main img")
      .evaluateAll((imgs) =>
        imgs
          .filter((i) => i.getClientRects().length && (!i.complete || i.naturalWidth === 0))
          .map((i) => i.src),
      );
    assert.deepEqual(broken, [], `Broken images at ${width}`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${output}/full-${width}.png`, fullPage: true });
    if (width === 375) {
      await page.getByRole("button", { name: "Open menu", exact: true }).click();
      await page
        .locator(".main-nav")
        .getByRole("link", { name: "The counter", exact: true })
        .click();
      await page.waitForTimeout(1100);
      assert.equal(
        await page
          .getByRole("button", { name: "Open menu", exact: true })
          .getAttribute("aria-expanded"),
        "false",
      );
      assert.ok(
        await page.evaluate(
          () =>
            Math.abs(document.querySelector("#favorites").getBoundingClientRect().top - 100) < 30,
        ),
      );
    }
    if (width === 1440) {
      await page.evaluate(() =>
        window.scrollTo(
          0,
          document.querySelector(".ritual-beat-3").getBoundingClientRect().top + scrollY - 300,
        ),
      );
      await page.waitForTimeout(400);
      assert.match(await page.locator(".ritual-scene-count").innerText(), /4/);
      await page.evaluate(() =>
        window.scrollTo(
          0,
          document.querySelector(".ritual-beat-0").getBoundingClientRect().top + scrollY - 300,
        ),
      );
      await page.waitForTimeout(400);
      assert.match(await page.locator(".ritual-scene-count").innerText(), /1/);
    }
    if (width === 1440) {
      await page.setViewportSize({ width: 375, height: 812 });
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .waitFor({ state: "visible" });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.locator('.main-nav a[href="#favorites"]').click();
      await page.waitForTimeout(1200);
      await page.locator('.main-nav a[href="#atmosphere"]').click();
      await page.waitForTimeout(1200);
      await page.goBack();
      await page.waitForTimeout(1200);
      assert.equal(new URL(page.url()).hash, "#favorites");
      assert.equal(
        await page.locator('.main-nav a[href="#favorites"]').getAttribute("aria-current"),
        "location",
      );
    }
    results.push({
      width,
      http: 200,
      overflow: false,
      cart: "passed",
      persistence: "passed",
      images: "passed",
      navigation: "passed",
    });
    await context.close();
  }
  const reduced = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const p = await reduced.newPage();
  await p.goto(base);
  await p.waitForTimeout(1000);
  assert.equal(
    await p.locator(".marquee-track").evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  assert.equal(await p.locator("html").evaluate((el) => el.classList.contains("lenis")), false);
  assert.equal(await p.locator("h1").evaluate((el) => getComputedStyle(el).opacity), "1");
  await p.emulateMedia({ reducedMotion: "no-preference" });
  await p.waitForTimeout(100);
  assert.equal(await p.locator("html").evaluate((el) => el.classList.contains("lenis")), true);
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.waitForTimeout(100);
  assert.equal(await p.locator("html").evaluate((el) => el.classList.contains("lenis")), false);
  results.push({ reducedMotion: "passed" });
  await reduced.close();
  assert.deepEqual(errors, [], "Browser errors");
  console.log(JSON.stringify({ base, results, errors }, null, 2));
  await writeFile(
    `${output}/results.json`,
    JSON.stringify({ base, results, errors }, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
