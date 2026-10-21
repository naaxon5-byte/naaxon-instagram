// Centro de control de Instagram: una acción por ejecución, resultado en JSON.
//
// Uso: node scripts/instagram.mjs <accion> '<parametros JSON>' <salida.json>
//
// Acciones de lectura (sin aprobación):
//   perfil          datos de la cuenta (seguidores, publicaciones…)
//   publicaciones   últimas publicaciones con me gusta y comentarios   {limite}
//   estadisticas    alcance, visualizaciones, guardados… de la cuenta y de
//                   las últimas publicaciones                           {limite, dias}
//   comentarios     comentarios (y respuestas) de las últimas publicaciones {limite}
//   mensajes        conversaciones de mensajes directos                  {limite}
// Acciones de escritura (el flujo las hace pasar por la aprobación del entorno «instagram»):
//   responder          responde a un comentario          {comentario, texto}
//   responder-mensaje  envía un mensaje directo           {destinatario, texto}
//
// Variables: IG_ACCESS_TOKEN, IG_USER_ID, IG_API_VERSION (opcional).
import { writeFile } from "node:fs/promises";

const [accion, paramsJson = "{}", salida = "resultado.json"] = process.argv.slice(2);
const { IG_ACCESS_TOKEN: token, IG_USER_ID: userId } = process.env;
const api = `https://graph.instagram.com/${process.env.IG_API_VERSION || "v23.0"}`;
let p;
try { p = JSON.parse(paramsJson || "{}"); } catch { salir(`Parámetros no válidos: ${paramsJson}`); }
if (!token || !userId) salir("Faltan IG_ACCESS_TOKEN o IG_USER_ID.");

const avisos = []; // permisos que faltan, métricas no disponibles…

const acciones = {
  async perfil() {
    return get("me", { fields: "user_id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url" });
  },

  async publicaciones() {
    return (await medios(p.limite ?? 12)).map(resumen);
  },

  async estadisticas() {
    const dias = Math.min(p.dias ?? 7, 30);
    const hasta = Math.floor(Date.now() / 1000), desde = hasta - dias * 86400;
    const cuenta = {};
    for (const m of ["reach", "views", "accounts_engaged", "total_interactions", "likes", "comments", "saves", "shares", "follows_and_unfollows", "profile_links_taps"]) {
      const r = await getSuave(`${userId}/insights`, { metric: m, period: "day", metric_type: "total_value", since: desde, until: hasta });
      if (r?.data?.[0]) cuenta[m] = r.data[0].total_value ?? r.data[0].values;
    }
    const pubs = [];
    for (const md of await medios(p.limite ?? 8)) {
      const met = md.media_product_type === "STORY"
        ? ["reach", "views", "replies", "navigation", "shares", "total_interactions"]
        : ["reach", "views", "likes", "comments", "saved", "shares", "total_interactions"];
      const vals = {};
      for (const m of met) {
        const r = await getSuave(`${md.id}/insights`, { metric: m });
        if (r?.data?.[0]) vals[m] = r.data[0].values?.[0]?.value ?? r.data[0].total_value?.value;
      }
      pubs.push({ ...resumen(md), estadisticas: vals });
    }
    return { periodo_dias: dias, cuenta, publicaciones: pubs };
  },

  async comentarios() {
    const out = [];
    for (const md of await medios(p.limite ?? 8)) {
      if (!md.comments_count) continue;
      const r = await get(`${md.id}/comments`, { fields: "id,text,username,timestamp,like_count,replies{id,text,username,timestamp}", limit: 50 });
      out.push({ publicacion: resumen(md), comentarios: r.data ?? [] });
    }
    return out;
  },

  async mensajes() {
    const r = await get("me/conversations", { platform: "instagram", fields: "id,updated_time,participants,messages.limit(10){id,message,from,created_time}", limit: p.limite ?? 10 });
    return r.data ?? [];
  },

  async responder() {
    if (!p.comentario || !p.texto) salir("responder necesita {comentario, texto}.");
    return post(`${p.comentario}/replies`, { message: p.texto });
  },

  async "responder-mensaje"() {
    if (!p.destinatario || !p.texto) salir("responder-mensaje necesita {destinatario, texto}.");
    return post("me/messages", { recipient: JSON.stringify({ id: p.destinatario }), message: JSON.stringify({ text: p.texto }) });
  },
};

if (!acciones[accion]) salir(`Acción desconocida: ${accion}. Disponibles: ${Object.keys(acciones).join(", ")}`);
const datos = await acciones[accion]();
const resultado = { accion, parametros: p, fecha: new Date().toISOString(), avisos: [...new Set(avisos)], datos };
await writeFile(salida, JSON.stringify(resultado, null, 2));
console.log(`✓ ${accion}: resultado en ${salida}${avisos.length ? ` (${avisos.length} avisos)` : ""}`);

// --- utilidades ---
async function medios(limite) {
  const r = await get(`${userId}/media`, { fields: "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count", limit: Math.min(limite, 50) });
  return r.data ?? [];
}
function resumen(m) {
  return { id: m.id, fecha: m.timestamp, tipo: m.media_product_type ?? m.media_type, enlace: m.permalink,
    texto: (m.caption ?? "").split("\n")[0].slice(0, 90), me_gusta: m.like_count, comentarios: m.comments_count };
}
async function get(path, params) {
  return pedir(`${api}/${path}?${new URLSearchParams({ ...params, access_token: token })}`);
}
async function getSuave(path, params) { // no aborta: anota el aviso y sigue
  try { return await get(path, params); }
  catch (e) { avisos.push(`${params.metric ?? path}: ${e.message}`); return null; }
}
async function post(path, params) {
  return pedir(`${api}/${path}`, { method: "POST", body: new URLSearchParams({ ...params, access_token: token }) });
}
async function pedir(url, opciones) {
  const res = await fetch(url, opciones);
  const d = await res.json().catch(() => ({}));
  if (!res.ok || d.error) {
    const e = d.error ?? {};
    throw new Error(`${e.message ?? res.statusText} [código ${e.code ?? res.status}]`);
  }
  return d;
}
function salir(msg) { console.error(`✗ ${msg}`); process.exit(1); }
process.on("unhandledRejection", (e) => salir(e.message));
