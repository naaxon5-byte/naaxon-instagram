# Carrusel Naaxon psicología deportiva

_Started 2026-09-08 21:50 UTC_

---

## User

ROL
Actúa como diseñador gráfico especializado en contenido editorial
para redes sociales de marcas profesionales.

CONTEXTO
Naaxon es una consulta de psicología deportiva online. Necesito
maquetar un carrusel de 3 diapositivas para Instagram.

Identidad visual, a respetar sin desviaciones:
· Tinta #141B18 · Menta #5FD4A8 · Verde #2D7A5F · Hueso #F0F3F1
· Titulares en serif (Lora o Georgia), bold, muy grandes
· Volantas y textos pequeños en sans (Inter o Poppins), en
  mayúsculas con letter-spacing amplio para las volantas
· Sin degradados, sin sombras, sin iconos, sin fotos
· Márgenes generosos e iguales en las cuatro diapositivas

OBJETIVO
Que se lea entero en el feed a tamaño pequeño y que las tres
diapositivas se reconozcan como una serie.

FORMATO
1080 × 1350 px, tres diapositivas.

1 · Fondo tinta. Arriba izquierda, volanta en menta: "NAAXON ·
    PSICOLOGÍA DEPORTIVA". Titular serif blanco muy grande:
    "El plan no falla el domingo". Debajo una línea corta en
    menta como separador, y en serif regular menta: "falla el
    martes que lo dejaste pasar". Abajo izquierda, pequeño y
    gris: "Desliza".

2 · Fondo hueso. Volanta en verde: "LO QUE PASA DE VERDAD".
    Tres líneas en serif oscuro, cada una precedida de un guion
    corto en verde:
    "Un día sales tarde de trabajar y lo saltas."
    "Al siguiente ya te cuesta más volver."
    "Al tercero ya no es un día suelto: es que lo has dejado."
    Debajo, en sans gris y más pequeño: "Nadie abandona de golpe.
    Se abandona por acumulación de excepciones razonables."

3 · Fondo verde. Símbolo de la marca en blanco, centrado arriba.
    Titular serif blanco centrado: "La regla es no fallar dos
    veces seguidas." Debajo, serif regular en blanco roto:
    "Un día malo es un día malo. Dos empiezan a ser otra cosa."
    Más abajo: "¿Cuál es tu día flojo de la semana?" y, al pie,
    "naaxon.com" en sans pequeño.

TONO
Sobrio y editorial. Mucho aire. El texto manda: nada decorativo
que compita con él.

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

Contraste del pie de la diapositiva 2 corregido (#58635E, ~5.4:1).

Nota: el símbolo de la diapositiva 3 es un marcador geométrico provisional — si me pasas el logo real de Naaxon lo sustituyo.

## User

Este es el logo pero me gustaría editarlo y meterle algo de 3D es una neurona quiero mejorarlo muchísimo más

## Assistant



## Assistant

_[tool: read_file]_

_[tool: run_script]_

El símbolo es una neurona: soma con cinco dendritas y un axón grueso, todo en verde plano. Antes de rehacerlo te pregunto lo esencial — aviso: no puedo generar imágenes, trabajo con vectores y con 3D real renderizado (rotable y exportable como OBJ/GLB).

_[tool: ask_user]_

Espero tus respuestas para empezar.

## User

Answered — tipo_3d: Ambos: el objeto 3D para web/vídeo y una versión vector para el feed; marca_reglas: Sí, el logo es una excepción; forma: Reinterpretar: neurona reconocible pero geometría nueva; uso: Carrusel de Instagram, Web (cabecera)

## Assistant

_[tool: read_skill_prompt]_

_[tool: copy_starter_component]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: multi_screenshot]_

_[tool: dc_write]_

## Assistant

_[tool: show_html]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: dc_write]_

Ahora sustituyo el marcador provisional de la diapositiva 3 por el símbolo real.

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_set_props]_

_[tool: ready_for_verification]_

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Ahora confirmo que el modelo 3D se ve como debe.

_[tool: show_html]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: ready_for_verification]_

## User

Save this design as a PDF: `Naaxon Símbolo.dc.html`

## Assistant

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: show_pdf_export_dialog]_

La copia imprimible está lista (`Naaxon Símbolo-print.dc.html`, una página en flujo con márgenes de 0.75 in), pero el diálogo de exportación estaba ocupado y no se abrió la vista de impresión. Pídemelo otra vez en un momento y lo lanzo.

## User

Save as standalone HTML: `Naaxon Carrusel.dc.html`

## Assistant

_[tool: copy_files]_

_[tool: str_replace_edit]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: present_fs_item_for_download]_

Listo: archivo único con las fuentes incrustadas, funciona sin conexión.

## User

crea una portada para el nuevo carruesel de la nueva pubicación

## Assistant



## Assistant

_[tool: ask_user]_

Necesito el titular y el tema de la nueva publicación antes de maquetar la portada; en cuanto contestes el formulario, me pongo con ella.

## User

Answered — titular: Nadie compite sin presión; subtitulo: la diferencia es qué haces con ella; volanta: (déjala por defecto); fondo: Tinta; simbolo: Sí

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

He hecho la portada en `Naaxon Carrusel Presion.dc.html`. Usa la misma estructura que la diapositiva 1 de la serie anterior, así que se reconocen como de la misma marca:

- **Fondo y volanta:** fondo tinta, con la volanta por defecto en menta.
- **Titular:** "Nadie compite sin presión", en serif blanco grande.
- **Línea secundaria:** debajo, "la diferencia es qué haces con ella" en menta, tras el separador corto.
- **Pie:** "Desliza" abajo a la izquierda y el símbolo de la neurona en menta abajo a la derecha.

Está pendiente de revisión. Pásame el texto de las siguientes diapositivas y las maqueto con el mismo sistema.

## User

y lo demás?

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

He añadido las diapositivas 2 (fondo hueso, tres líneas) y 3 (fondo verde, cierre con pregunta) con la misma estructura que la serie anterior.

El texto de estas dos diapositivas lo he escrito yo como borrador, porque no me pasaste el tuyo:

- **Diapositiva 2:** "Lo que pasa antes de salir", con tres síntomas de la presión y el pie "La presión no desaparece antes de competir. Lo que cambia es cómo la interpretas."
- **Diapositiva 3:** "Esa activación es la energía para competir.", "Nómbrala, respira y vuelve a tu primera acción." y la pregunta "¿Dónde notas tú la presión antes de competir?"

Revísalo, o pásame tu texto y lo sustituyo tal cual.

