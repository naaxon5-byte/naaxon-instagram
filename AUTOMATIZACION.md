# Publicar carruseles en Instagram desde GitHub

El flujo `.github/workflows/publicar-instagram.yml` genera las imágenes, las aloja
en GitHub Pages (Instagram necesita descargarlas de una URL pública) y publica el
carrusel con el texto de `pie-instagram.txt`. Si la carpeta incluye una historia
(una `<section data-historia>` en el HTML, 1080×1920), la publica justo después
del carrusel. Se lanza siempre a mano.

## Paso 1 · Cuenta de Instagram profesional

En la app de Instagram: **Configuración → Tipo de cuenta y herramientas → Cambiar a
cuenta profesional** (Creador o Empresa). Si ya lo es, sigue.

## Paso 2 · Repositorio en GitHub

1. Crea un repositorio y sube esta rama.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   Con cuenta gratuita de GitHub, Pages solo funciona en repositorios públicos.

## Paso 3 · App de Meta

1. Entra en <https://developers.facebook.com/apps> y crea una app (tipo *Empresa*).
2. Añade el producto **Instagram** y elige **API con inicio de sesión de Instagram**.
3. En **Roles → Roles de la app**, añade tu cuenta de Instagram como *Evaluador de
   Instagram* y acepta la invitación desde Instagram
   (Configuración → Apps y sitios web → Invitaciones de evaluador).
4. En **Instagram → Configuración de la API**, genera un token de acceso para tu
   cuenta con los permisos `instagram_business_basic` e
   `instagram_business_content_publish`. Copia el **token** y el **ID de la cuenta**.

No hace falta publicar la app ni pasar la revisión de Meta para usarla con tu
propia cuenta.

## Paso 4 · Secrets en GitHub

**Settings → Environments → New environment → `instagram`**, y dentro:

| Secret            | Valor                         |
|-------------------|-------------------------------|
| `IG_ACCESS_TOKEN` | el token del paso 3           |
| `IG_USER_ID`      | el ID de la cuenta del paso 3 |

**Recomendado:** en *Deployment protection rules* activa **Required reviewers** y
añádete. Así cada publicación (también las automáticas) te pide aprobación antes
de salir; GitHub te avisa por correo y en la app móvil.

Opcional: variable `IG_API_VERSION` (por defecto `v23.0`) si Meta retira esa versión.

## Paso 5 · Prueba

**Actions → Publicar en Instagram → Run workflow**, con `modo: prueba`. Genera
todo y crea el carrusel (y la historia) en Instagram **sin publicarlo**. Si termina
en verde, la configuración es correcta.

## Paso 6 · Publicar

- **Manual:** lo mismo con `modo: publicar`.
- **Automático:** escribe el nombre de la carpeta en la primera línea sin `#` de
  `publicar.txt` y súbelo a `main`. Es lo que hace Claude cuando le das el visto
  bueno a una publicación.

El log final muestra el enlace al post.

## Paso 7 · Renovación automática del token

El token caduca a los 60 días. `renovar-token.yml` lo renueva el día 1 de cada mes,
pero para guardar el nuevo necesita un token de GitHub con permiso sobre secrets:

1. <https://github.com/settings/personal-access-tokens/new> (*fine-grained token*).
2. **Repository access → Only select repositories →** `naaxon-instagram`.
3. **Permissions → Repository permissions:** `Secrets` y `Environments` en
   **Read and write**. Caducidad: la máxima que permita (o sin caducidad).
4. Guárdalo en el entorno `instagram` como secret **`GH_SECRETS_TOKEN`**.
5. Pruébalo: **Actions → Renovar token de Instagram → Run workflow.**

Si tienes *Required reviewers*, la renovación también pide aprobación (una vez al
mes). Si falla, GitHub te avisa por correo: renueva el token a mano generando uno
nuevo en Meta y actualiza `IG_ACCESS_TOKEN`.

## Mantenimiento

- **Nuevo carrusel:** copia `presion/` a una carpeta nueva, cambia el HTML y el
  `pie-instagram.txt`, genera con `node scripts/build.mjs <carpeta>` y publícalo
  (manual o con `publicar.txt`). Los detalles están en `CLAUDE.md`.
- La API no permite añadir música ni etiquetar productos, ni stickers, enlaces o
  encuestas en las historias.
- Publicar historias por API requiere cuenta de tipo Empresa.
