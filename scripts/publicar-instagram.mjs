// Publica un carrusel (y, si la hay, una historia) en Instagram con la API de
// Instagram (inicio de sesión con Instagram).
//
// Carrusel: los .jpg de la carpeta excepto los que contienen "historia".
// Historia: el .jpg que contiene "historia" (opcional), publicado tras el carrusel.
//
// Uso: node scripts/publicar-instagram.mjs <carpeta-dist> <url-publica-base>
//
// Variables de entorno:
//   IG_ACCESS_TOKEN   token de acceso de la cuenta profesional (secret)
//   IG_USER_ID        ID de la cuenta de Instagram (secret)
//   IG_API_VERSION    versión de la API, p. ej. v23.0 (opcional)
//   MODO              "prueba" (crea los contenedores sin publicar) o "publicar"
//
// Las imágenes deben estar en <url-publica-base>/<nombre>.jpg y ser accesibles
// sin autenticación: Instagram las descarga desde esa URL.
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const [dir, baseUrl] = process.argv.slice(2);
const { IG_ACCESS_TOKEN: token, IG_USER_ID: userId } = process.env;
const version = process.env.IG_API_VERSION || "v23.0";
const modo = process.env.MODO || "prueba";

if (!dir || !baseUrl) fail("Uso: node scripts/publicar-instagram.mjs <carpeta-dist> <url-publica-base>");
if (!token || !userId) fail("Faltan IG_ACCESS_TOKEN o IG_USER_ID.");
if (!["prueba", "publicar"].includes(modo)) fail(`MODO desconocido: ${modo}`);

const api = `https://graph.instagram.com/${version}`;
const base = baseUrl.replace(/\/?$/, "/");

const jpgs = (await readdir(dir)).filter((f) => f.endsWith(".jpg")).sort();
const imagenes = jpgs.filter((f) => !f.includes("historia"));
const historias = jpgs.filter((f) => f.includes("historia"));
if (historias.length > 1) fail(`Solo se admite una historia; hay ${historias.length}.`);
const historia = historias[0];
if (imagenes.length < 2 || imagenes.length > 10) {
  fail(`Un carrusel necesita entre 2 y 10 imágenes; hay ${imagenes.length} en ${dir}.`);
}
const caption = (await readFile(join(dir, "pie-instagram.txt"), "utf8")).trim();
if (caption.length > 2200) fail(`El pie tiene ${caption.length} caracteres; el máximo es 2200.`);

console.log(`Modo: ${modo} · ${imagenes.length} imágenes · pie de ${caption.length} caracteres · ${historia ? "con" : "sin"} historia`);

// 0. GitHub Pages puede tardar unos segundos en servir los archivos recién
// desplegados: espera a que cada imagen responda como JPEG antes de seguir.
for (const nombre of [...imagenes, ...(historia ? [historia] : [])]) await esperarUrl(base + nombre);

// 1. Un contenedor por imagen
const hijos = [];
for (const nombre of imagenes) {
  const url = base + nombre;
  const { id } = await post(`${userId}/media`, { image_url: url, is_carousel_item: "true" });
  console.log(`✓ contenedor ${id} ← ${url}`);
  hijos.push(id);
}
for (const id of hijos) await esperarListo(id);

// 2. Contenedor del carrusel con el pie
const { id: carrusel } = await post(`${userId}/media`, {
  media_type: "CAROUSEL",
  children: hijos.join(","),
  caption,
});
await esperarListo(carrusel);
console.log(`✓ carrusel ${carrusel} listo`);

// 3. Contenedor de la historia
let contenedorHistoria;
if (historia) {
  const url = base + historia;
  ({ id: contenedorHistoria } = await post(`${userId}/media`, { media_type: "STORIES", image_url: url }));
  await esperarListo(contenedorHistoria);
  console.log(`✓ historia ${contenedorHistoria} lista ← ${url}`);
}

if (modo === "prueba") {
  console.log("Modo prueba: no se publica. Todo está bien configurado.");
  process.exit(0);
}

// 4. Publicación: primero el carrusel, después la historia
const { id: mediaId } = await post(`${userId}/media_publish`, { creation_id: carrusel });
const { permalink } = await get(mediaId, { fields: "permalink" });
console.log(`✓ Carrusel publicado: ${permalink ?? mediaId}`);

if (contenedorHistoria) {
  const { id: historiaId } = await post(`${userId}/media_publish`, { creation_id: contenedorHistoria });
  console.log(`✓ Historia publicada: ${historiaId}`);
}

async function esperarUrl(url) {
  for (let intento = 0; intento < 24; intento++) {
    const res = await fetch(url, { method: "HEAD" }).catch(() => null);
    if (res?.ok && (res.headers.get("content-type") ?? "").startsWith("image/jpeg")) {
      console.log(`✓ accesible ${url}`);
      return;
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  fail(`La imagen no está accesible tras 2 minutos: ${url}`);
}

async function esperarListo(id) {
  for (let intento = 0; intento < 30; intento++) {
    const { status_code } = await get(id, { fields: "status_code" });
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") fail(`Contenedor ${id}: ${status_code}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  fail(`Contenedor ${id} no estuvo listo a tiempo.`);
}

async function post(path, params) {
  // Código 9004: Instagram no pudo descargar la imagen; suele ser transitorio.
  for (let intento = 1; ; intento++) {
    try {
      return await pedir(`${api}/${path}`, { method: "POST", body: new URLSearchParams({ ...params, access_token: token }) });
    } catch (e) {
      if (e.codigo !== 9004 || intento >= 4) fail(e.message);
      console.log(`… Instagram no pudo leer la imagen (intento ${intento}); reintento en 15 s`);
      await new Promise((r) => setTimeout(r, 15000));
    }
  }
}

async function get(path, params) {
  return pedir(`${api}/${path}?${new URLSearchParams({ ...params, access_token: token })}`).catch((e) => fail(e.message));
}

async function pedir(url, opciones) {
  const res = await fetch(url, opciones);
  const datos = await res.json().catch(() => ({}));
  if (!res.ok || datos.error) {
    const e = datos.error ?? {};
    const err = new Error(`Error de la API (${res.status}): ${e.message ?? res.statusText} [tipo ${e.type ?? "?"}, código ${e.code ?? "?"}]`);
    err.codigo = e.code;
    throw err;
  }
  return datos;
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}
