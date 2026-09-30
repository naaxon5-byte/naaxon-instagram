// Genera <carpeta>/dist/ a partir del HTML de la carpeta:
//   naaxon-<carpeta>.html              HTML autónomo (fuentes incrustadas)
//   naaxon-<carpeta>-NN.png/.jpg       una imagen por <section data-slide="NN"> (carrusel)
//   naaxon-<carpeta>-historia-NN.*     una imagen por <section data-historia="NN">
//   pie-instagram.txt                  copia del pie de la publicación
//
// Uso: node scripts/build.mjs <carpeta>   (requiere playwright con Chromium)
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { basename, dirname, join, resolve } from "node:path";
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

const carpeta = process.argv[2];
if (!carpeta) {
  console.error("Uso: node scripts/build.mjs <carpeta>");
  process.exit(1);
}
const dir = resolve(carpeta);
const slug = basename(dir);
const htmls = (await readdir(dir)).filter((f) => f.endsWith(".html"));
if (htmls.length !== 1) {
  console.error(`✗ ${carpeta} debe contener exactamente un .html; hay ${htmls.length}.`);
  process.exit(1);
}
const src = join(dir, htmls[0]);
const dist = join(dir, "dist");
await mkdir(dist, { recursive: true });

// 1. HTML autónomo: sustituye las url() de fuentes por data URIs
let html = await readFile(src, "utf8");
html = await replaceAsync(html, /url\("([^"]+\.woff2)"\)/g, async (_, rel) => {
  const b64 = (await readFile(resolve(dirname(src), rel))).toString("base64");
  return `url("data:font/woff2;base64,${b64}")`;
});
const standalone = join(dist, `naaxon-${slug}.html`);
await writeFile(standalone, html);

// 2. Imágenes a tamaño nativo: PNG para revisar, JPEG para la API de Instagram
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(standalone).href);
await page.evaluate(() => document.fonts.ready);
const secciones = await page.locator("section[data-slide], section[data-historia]").all();
for (const seccion of secciones) {
  const n = await seccion.getAttribute("data-slide");
  const nombre = n ? `naaxon-${slug}-${n}` : `naaxon-${slug}-historia-${await seccion.getAttribute("data-historia")}`;
  await seccion.screenshot({ path: join(dist, `${nombre}.png`), animations: "disabled" });
  await seccion.screenshot({ path: join(dist, `${nombre}.jpg`), type: "jpeg", quality: 95, animations: "disabled" });
  console.log("✓", join(dist, nombre) + ".png/.jpg");
}
await browser.close();
console.log("✓", standalone);

// 3. Pie de la publicación (texto para Instagram, fuera de las imágenes)
await writeFile(join(dist, "pie-instagram.txt"), await readFile(join(dir, "pie-instagram.txt")));
console.log("✓", join(dist, "pie-instagram.txt"));

async function replaceAsync(str, re, fn) {
  const parts = await Promise.all([...str.matchAll(re)].map((m) => fn(...m)));
  let i = 0;
  return str.replace(re, () => parts[i++]);
}
