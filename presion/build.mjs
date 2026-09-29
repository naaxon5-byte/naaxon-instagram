// Genera dist/: HTML autónomo (fuentes incrustadas) + un PNG 1080×1350 por diapositiva.
// Uso: node build.mjs   (requiere playwright con Chromium disponible)
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  // Fallback a una instalación global de playwright
  const { execSync } = await import("node:child_process");
  const globalRoot = execSync("npm root -g").toString().trim();
  ({ chromium } = require(join(globalRoot, "playwright")));
}

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "carrusel-presion.html");
const dist = join(here, "dist");
await mkdir(dist, { recursive: true });

// 1. HTML autónomo: sustituye las url() de fuentes por data URIs
let html = await readFile(src, "utf8");
html = await replaceAsync(html, /url\("(fonts\/[^"]+\.woff2)"\)/g, async (_, rel) => {
  const b64 = (await readFile(join(here, rel))).toString("base64");
  return `url("data:font/woff2;base64,${b64}")`;
});
const standalone = join(dist, "naaxon-carrusel-presion.html");
await writeFile(standalone, html);

// 2. PNGs a tamaño nativo
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1450 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(standalone).href);
await page.evaluate(() => document.fonts.ready);
const slides = await page.locator("section[data-slide]").all();
for (const slide of slides) {
  const n = await slide.getAttribute("data-slide");
  const out = join(dist, `naaxon-presion-${n}.png`);
  await slide.screenshot({ path: out, animations: "disabled" });
  console.log("✓", out);
  // JPEG para la API de Instagram, que no acepta PNG
  const jpg = out.replace(/\.png$/, ".jpg");
  await slide.screenshot({ path: jpg, type: "jpeg", quality: 95, animations: "disabled" });
  console.log("✓", jpg);
}
await browser.close();
console.log("✓", standalone);

// 3. Pie de la publicación (texto para Instagram, fuera de las imágenes)
const caption = join(dist, "pie-instagram.txt");
await writeFile(caption, await readFile(join(here, "pie-instagram.txt")));
console.log("✓", caption);

async function replaceAsync(str, re, fn) {
  const parts = await Promise.all([...str.matchAll(re)].map((m) => fn(...m)));
  let i = 0;
  return str.replace(re, () => parts[i++]);
}
