/**
 * Regra: nenhuma imagem pode aparecer distorcida (esticada/achatada).
 * Percorre as páginas em várias larguras e confere cada <img> visível: com object-fit "fill"
 * (o padrão), a proporção da caixa tem que ser igual à da imagem (tolerância de 2%).
 * Uso: node scripts/check-image-aspect.mjs http://127.0.0.1:3000   (sai com 1 se achar distorção)
 */
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const PAGES = ["/", "/a-farvalle", "/cursos", "/cursos/enfermagem", "/cursos/fisioterapia", "/cursos/pedagogia", "/matricular", "/noticias", "/contato", "/publicacoes-institucionais", "/inscricao-enviada", "/pagina-que-nao-existe"];
const WIDTHS = [320, 390, 768, 1024, 1366, 1920, 2560, 3840];

const browser = await pw.chromium.launch();
const bad = new Set();
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: "networkidle" }).catch(() => {});
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    await page.waitForTimeout(300);
    const found = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => img.naturalWidth && img.getBoundingClientRect().width > 8)
        .map((img) => {
          const r = img.getBoundingClientRect();
          const fit = getComputedStyle(img).objectFit;
          const natural = img.naturalWidth / img.naturalHeight;
          const box = r.width / r.height;
          return { src: img.currentSrc || img.src, fit, error: Math.abs(box / natural - 1) };
        })
        .filter((i) => i.fit === "fill" && i.error > 0.02)
    );
    for (const f of found) bad.add(`${path} @${width}px  ${decodeURIComponent(f.src).replace(/.*url=([^&]+).*/, "$1")}  (${(f.error * 100).toFixed(1)}%)`);
  }
  await page.close();
}
await browser.close();
for (const b of bad) console.log(b);
console.log(bad.size ? `${bad.size} imagem(ns) distorcida(s)` : "Nenhuma imagem distorcida.");
process.exit(bad.size ? 1 : 0);
