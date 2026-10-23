# Naaxon · carruseles de Instagram

Naaxon es una consulta de psicología deportiva online (cuenta de Instagram
**naaxon.psico**). Este repositorio diseña carruseles e historias y los publica en
Instagram mediante GitHub Actions. La persona usuaria habla en español: responde
en español.

## Estructura

- `<carpeta>/` — una publicación por carpeta (p. ej. `presion/`), con:
  - un único `.html` con las diapositivas: `<section data-slide="01">` (1080×1350)
    y, opcional, `<section data-historia="01">` (1080×1920);
  - `pie-instagram.txt` — el texto de la publicación (máx. 2200 caracteres);
  - `dist/` — generado por `node scripts/build.mjs <carpeta>` (PNG para revisar,
    JPEG para la API, HTML autónomo y copia del pie). Se versiona.
- `fonts/` — Lora e Inter (latin), compartidas. El HTML las enlaza con `../fonts/`.
- `scripts/build.mjs` — genera `dist/`. `scripts/publicar-instagram.mjs` — publica.
- `publicar.txt` — cola: al subir a `main` un cambio aquí, se publica la carpeta
  de su primera línea sin `#`.
- `.github/workflows/publicar-instagram.yml` — construye, aloja en GitHub Pages y
  publica. `renovar-token.yml` — renueva el token cada mes.
- `AUTOMATIZACION.md` — guía de configuración de Meta y GitHub.
- `project/`, `chats/`, `README.md` — material original de Claude Design (referencia).

## Identidad visual (sin desviaciones)

- Colores: Tinta `#141B18` · Menta `#5FD4A8` · Verde `#2D7A5F` · Hueso `#F0F3F1`;
  blanco `#FFFFFF`; grises de texto `#7C8A85` (sobre tinta) y `#58635E` (sobre hueso).
- Titulares en Lora bold, muy grandes; texto en Lora regular.
- Volantas y textos pequeños en Inter, mayúsculas con letter-spacing amplio.
- Sin degradados, sombras, iconos ni fotos. El único elemento gráfico es el
  símbolo de la neurona (`<symbol id="naaxon-simbolo">` en el HTML).
- Márgenes de 96 px iguales en todas las diapositivas. Historias: 260 px arriba y
  300 px abajo para librar las barras de Instagram.
- Tono sobrio y editorial, mucho aire, el texto manda.
- Serie de 3 diapositivas: 01 portada (fondo tinta, volanta, titular, separador
  menta, subtítulo, «Desliza» + símbolo) · 02 desarrollo (fondo hueso, tres líneas
  con guion verde, pie gris) · 03 cierre (fondo verde, símbolo, titular, pregunta,
  «naaxon.com»). Parte de `rutina-precompeticion/` como plantilla: su portada
  (`portada-centrada`) lleva el titular centrado en vertical, que se ve mejor en
  la cuadrícula del perfil (Instagram la recorta a 3:4).

## Flujo para una publicación nueva

1. Crea `<carpeta>/` copiando `rutina-precompeticion/` (nombre en minúsculas y guiones), cambia
   los textos del HTML y escribe `pie-instagram.txt`. Borra el `dist/` copiado.
2. `node scripts/build.mjs <carpeta>` y revisa visualmente los PNG de `dist/`.
3. Enseña las imágenes y el pie a la persona usuaria (SendUserFile) y espera su
   visto bueno explícito.
4. Solo con ese visto bueno: pon `<carpeta>` como primera línea sin `#` de
   `publicar.txt`, haz commit en `main` y push. Eso publica en Instagram.

## Centro de control de Instagram

Desde este entorno no hay acceso directo a la API de Instagram: todo pasa por el
flujo `.github/workflows/instagram.yml`, que Claude lanza con `gh api`:

```
gh api -X POST repos/naaxon5-byte/naaxon-instagram/actions/workflows/instagram.yml/dispatches \
  -f ref=main -f 'inputs[accion]=estadisticas' -f 'inputs[parametros]={"limite":8,"dias":7}'
```

Acciones: `perfil`, `publicaciones`, `estadisticas`, `comentarios`, `mensajes`
(lectura) y `responder`, `responder-mensaje` (escritura, pasan por la aprobación
del entorno `instagram`). El resultado queda en la rama `datos`:
`git fetch origin datos && git show origin/datos:datos/ultimo-<accion>.json`.
Código: `scripts/instagram.mjs`. Los secrets `IG_ACCESS_TOKEN` e `IG_USER_ID` están
a nivel de repositorio.

## Reglas

- **Nunca** modifiques `publicar.txt` ni lances una publicación sin aprobación
  explícita de la persona usuaria en esa conversación: publicar es público.
- Lo mismo para `responder` y `responder-mensaje`: enseña antes el texto exacto y
  espera el visto bueno. Las acciones de lectura se pueden lanzar libremente.
- No escribas tokens ni secrets en el repositorio ni en el chat.
- Los textos de salud mental: sobrios, sin prometer resultados ni diagnosticar.
