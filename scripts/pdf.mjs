// Genera un PDF A4 a partir de un HTML. Uso: node scripts/pdf.mjs <entrada.html> <salida.pdf>
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require(execSync("npm root -g").toString().trim() + "/playwright")); }
const [entrada, salida] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(pathToFileURL(resolve(entrada)).href);
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: salida, format: "A4", printBackground: true, preferCSSPageSize: true });
await b.close();
console.log("✓", salida);
