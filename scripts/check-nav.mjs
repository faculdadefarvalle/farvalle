#!/usr/bin/env node
/**
 * Testa a navegação do site: menu desktop (hover/clique nos dropdowns), menu mobile
 * (abrir, abrir submenus, links dos submenus) e se cada link do menu leva a uma página 2xx.
 *
 * Uso: node scripts/check-nav.mjs http://127.0.0.1:3000
 * Requer Playwright (npx playwright install chromium) — ou PLAYWRIGHT_MODULE / PLAYWRIGHT_CHROMIUM
 * apontando para uma instalação existente.
 * Sai com código 1 se qualquer menu/submenu não abrir ou algum link do menu estiver quebrado.
 */
const base = process.argv[2] || "http://127.0.0.1:3000";
const moduleSpec = process.env.PLAYWRIGHT_MODULE || "playwright";
const { chromium } = await import(moduleSpec);
const launch = process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {};
const browser = await chromium.launch(launch);
const failures = [];
const note = (ok, label) => {
  console.log(`${ok ? "✓" : "✗"} ${label}`);
  if (!ok) failures.push(label);
};

async function openPage(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.route(/fonts\.gstatic|google\.com/, (r) => r.abort());
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForTimeout(500);
  return page;
}

// ---------- Desktop ----------
{
  const page = await openPage(1366);
  const dropdowns = page.locator('nav button[aria-haspopup="true"]');
  const count = await dropdowns.count();
  note(count > 0, `desktop: ${count} menu(s) com submenu encontrados`);
  for (let i = 0; i < count; i++) {
    const button = dropdowns.nth(i);
    const label = (await button.innerText()).trim();
    await button.hover(); // no desktop o dropdown abre ao passar o mouse
    await page.waitForTimeout(250);
    const expanded = (await button.getAttribute("aria-expanded")) === "true";
    const sub = page.locator('nav ul[class*="dropdownOpen"] a');
    const visible = expanded && (await sub.count()) > 0 && (await sub.first().isVisible());
    note(visible, `desktop: submenu "${label}" abre com ${await sub.count()} link(s)`);
    for (let j = 0; j < (await sub.count()); j++) {
      const href = await sub.nth(j).getAttribute("href");
      const res = await page.request.get(base + href);
      note(res.ok(), `desktop: link do submenu ${href} → ${res.status()}`);
    }
    await page.mouse.move(5, 5);
    await page.waitForTimeout(200);
  }
  // Links de primeiro nível
  const top = page.locator("nav a[href]");
  for (let i = 0; i < (await top.count()); i++) {
    const href = await top.nth(i).getAttribute("href");
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) continue;
    const res = await page.request.get(base + href);
    note(res.ok(), `desktop: link do menu ${href} → ${res.status()}`);
  }
  await page.close();
}

// ---------- Mobile ----------
{
  const page = await openPage(390);
  const toggle = page.locator('button[aria-label="Abrir menu"]');
  note((await toggle.count()) === 1, "mobile: botão do menu presente");
  await toggle.click();
  await page.waitForTimeout(400);
  const panel = page.locator('[class*="mobileOpen"]');
  note((await panel.count()) === 1 && (await panel.isVisible()), "mobile: painel do menu abre");
  const subButtons = panel.locator("button[aria-expanded]");
  const count = await subButtons.count();
  note(count > 0, `mobile: ${count} submenu(s) encontrados`);
  for (let i = 0; i < count; i++) {
    const button = subButtons.nth(i);
    const label = (await button.innerText()).trim();
    await button.click();
    await page.waitForTimeout(300);
    const expanded = (await button.getAttribute("aria-expanded")) === "true";
    const sub = panel.locator('ul[class*="mobileSubOpen"] a');
    const visible = expanded && (await sub.count()) > 0 && (await sub.first().isVisible());
    note(visible, `mobile: submenu "${label}" abre e fica aberto com ${await sub.count()} link(s)`);
    for (let j = 0; j < (await sub.count()); j++) {
      const href = await sub.nth(j).getAttribute("href");
      const res = await page.request.get(base + href);
      note(res.ok(), `mobile: link do submenu ${href} → ${res.status()}`);
    }
  }
  // Navegar por um link do submenu de fato
  const firstSubLink = panel.locator('ul[class*="mobileSubOpen"] a').first();
  if ((await firstSubLink.count()) > 0) {
    const href = await firstSubLink.getAttribute("href");
    await firstSubLink.click();
    const arrived = await page.waitForURL("**" + href, { timeout: 10000 }).then(() => true).catch(() => false);
    note(arrived, `mobile: clique no submenu navegou para ${href}`);
  }
  await page.close();
}

await browser.close();
console.log(`\n${failures.length ? `${failures.length} falha(s)` : "Menus e submenus OK"}`);
process.exit(failures.length ? 1 : 0);
