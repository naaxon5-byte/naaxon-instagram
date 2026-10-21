#!/bin/bash
# Guarda un resultado JSON en la rama «datos» (datos/<fecha>-<accion>.json y
# datos/ultimo-<accion>.json). Uso: guardar-datos.sh <archivo.json> <accion>
set -euo pipefail
archivo="$1"; accion="$2"
sello="$(date -u +%Y-%m-%dT%H%M%SZ)"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
if git fetch -q origin datos 2>/dev/null; then
  git checkout -q -B datos origin/datos
else
  git checkout -q --orphan datos
  git rm -rfq . >/dev/null
  printf '# Datos de Instagram\n\nResultados del flujo «Instagram (centro de control)».\n' > README.md
fi
mkdir -p datos
cp "$archivo" "datos/${sello}-${accion}.json"
cp "$archivo" "datos/ultimo-${accion}.json"
git add -A
git commit -qm "Instagram: ${accion} (${sello})"
git push -q origin datos
echo "✓ guardado en la rama datos: datos/${sello}-${accion}.json"
