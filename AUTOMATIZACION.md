# Publicar carruseles en Instagram desde GitHub

El flujo `.github/workflows/publicar-instagram.yml` genera las imágenes, las aloja
en GitHub Pages (Instagram necesita descargarlas de una URL pública) y publica el
carrusel con el texto de `pie-instagram.txt`. Se lanza siempre a mano.

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

Opcional: en *Protection rules* activa **Required reviewers** para que cada
publicación pida tu aprobación antes de salir.

Opcional: variable `IG_API_VERSION` (por defecto `v23.0`) si Meta retira esa versión.

## Paso 5 · Prueba

**Actions → Publicar en Instagram → Run workflow**, con `modo: prueba`. Genera
todo y crea el carrusel en Instagram **sin publicarlo**. Si termina en verde, la
configuración es correcta.

## Paso 6 · Publicar

Lo mismo con `modo: publicar`. El log final muestra el enlace al post.

## Mantenimiento

- **El token caduca a los 60 días.** Renuévalo antes con:
  `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=TOKEN_ACTUAL`
  y actualiza el secret `IG_ACCESS_TOKEN`.
- **Nuevo carrusel:** copia la carpeta `presion/`, cambia el HTML y el
  `pie-instagram.txt`, y lanza el flujo con esa carpeta en `carpeta`.
- La API no permite añadir música ni etiquetar productos.
