/**
 * Coleta, para cada foto visível (img com object-fit e fundos CSS com background-size: cover),
 * qual pedaço da imagem original aparece na tela, em várias páginas e larguras.
 * Saída: JSON para scripts/check-heads.py (regra: nunca cortar a cabeça das pessoas).
 *
 * Uso: node scripts/check-heads-collect.mjs http://127.0.0.1:3000 > /tmp/visiveis.json
 *   (PLAYWRIGHT_MODULE=/caminho/para/playwright se o pacote não estiver no projeto)
 */
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const PAGES = ["/", "/a-farvalle", "/cursos", "/cursos/enfermagem", "/cursos/fisioterapia", "/cursos/pedagogia", "/matricular", "/noticias", "/contato"];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1180, 1366, 1600, 1920, 2560];

const browser = await pw.chromium.launch();
const out = [];
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: "networkidle" }).catch(() => {});
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const items = await page.evaluate(async () => {
      // object-position / background-position -> deslocamento em px (aceita %, px e palavras-chave)
      const offset = (v, axis, free) => {
        const map = { left: 0, top: 0, center: 50, right: 100, bottom: 100 };
        const parts = (v || "50% 50%").trim().split(/\s+/);
        let [x, y] = parts.length === 1 ? [parts[0], "50%"] : parts;
        if (["top", "bottom"].includes(x) || ["left", "right"].includes(y)) [x, y] = [y, x];
        const t = axis === "x" ? x : y;
        if (t in map) return (free * map[t]) / 100;
        if (t.endsWith("%")) return (free * parseFloat(t)) / 100;
        if (t.endsWith("px")) return parseFloat(t);
        return free / 2;
      };
      const visibleRect = (nw, nh, bw, bh, fit, position) => {
        if (!(nw && nh && bw && bh)) return null;
        let s;
        if (fit === "cover") s = Math.max(bw / nw, bh / nh);
        else if (fit === "contain" || fit === "scale-down") s = Math.min(bw / nw, bh / nh);
        else return { x: 0, y: 0, w: 1, h: 1 };
        const ox = offset(position, "x", bw - nw * s);
        const oy = offset(position, "y", bh - nh * s);
        const x0 = Math.max(0, -ox / s), y0 = Math.max(0, -oy / s);
        // em frações da imagem (o next/image pode servir uma versão reduzida)
        return { x: x0 / nw, y: y0 / nh, w: Math.min(nw - x0, bw / s) / nw, h: Math.min(nh - y0, bh / s) / nh };
      };
      const res = [];
      const shown = (el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 20 && r.height > 20 && cs.visibility !== "hidden" && cs.display !== "none" && el.checkVisibility?.({ opacityProperty: true }) !== false;
      };
      for (const img of document.querySelectorAll("img")) {
        if (!shown(img) || !img.naturalWidth) continue;
        const cs = getComputedStyle(img);
        const r = img.getBoundingClientRect();
        let src = img.currentSrc || img.src;
        const m = src.match(/[?&]url=([^&]+)/);
        if (m) src = decodeURIComponent(m[1]);
        res.push({ kind: "img", src: new URL(src, location.href).pathname, box: [r.width, r.height], rect: visibleRect(img.naturalWidth, img.naturalHeight, r.width, r.height, cs.objectFit, cs.objectPosition) });
      }
      for (const el of document.querySelectorAll("section, div, a, figure")) {
        const cs = getComputedStyle(el);
        if (!cs.backgroundImage.includes("url(") || cs.backgroundSize !== "cover" || !shown(el)) continue;
        const url = cs.backgroundImage.match(/url\("?([^")]+)"?\)/)[1];
        const im = new Image();
        im.src = url;
        await im.decode().catch(() => {});
        const r = el.getBoundingClientRect();
        res.push({ kind: "bg", src: new URL(url, location.href).pathname, box: [r.width, r.height], rect: visibleRect(im.naturalWidth, im.naturalHeight, r.width, r.height, "cover", cs.backgroundPosition) });
      }
      return res;
    });
    for (const it of items) out.push({ page: path, width, ...it });
  }
  await page.close();
}
await browser.close();
process.stdout.write(JSON.stringify(out));
