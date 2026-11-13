#!/usr/bin/env bash
# =====================================================
#  OPTIMISER-IMAGES.SH
#  Crée, pour chaque photo du dossier images/, deux versions WebP :
#    images/xxx/opti/NOM-800.webp   (vignette, 800 px de côté max)
#    images/xxx/opti/NOM-2000.webp  (grande, 2000 px de côté max)
#  Les originaux ne sont jamais modifiés.
#
#  Prérequis : ImageMagick 7 (commande "magick") OU cwebp (paquet libwebp).
#  Sous Windows : à lancer depuis Git Bash ou WSL, dans le dossier du site :
#      bash optimiser-images.sh          (ne refait pas les images déjà créées)
#      bash optimiser-images.sh --force  (refait tout)
#
#  Ensuite : dans medias.js, passe IMAGES_OPTIMISEES à true.
# =====================================================
set -euo pipefail

DOSSIER="images"
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

# NB : on n'utilise jamais "convert" seul, qui sous Windows est un outil
# système de conversion de disque, sans rapport avec ImageMagick.
if command -v magick >/dev/null 2>&1; then
  OUTIL="magick"
elif command -v cwebp >/dev/null 2>&1 && command -v identify >/dev/null 2>&1; then
  OUTIL="cwebp"   # cwebp pour l'encodage, identify (ImageMagick 6) pour lire les dimensions
else
  echo "Erreur : installe ImageMagick 7 (https://imagemagick.org, commande « magick »)." >&2
  exit 1
fi
echo "Outil utilisé : $OUTIL"

# Convertit $1 en $2, côté le plus long limité à $3 px, qualité $4
convertir() {
  local source="$1" cible="$2" taille="$3" qualite="$4"
  if [ "$OUTIL" = "magick" ]; then
    magick "$source" -auto-orient -resize "${taille}x${taille}>" -strip -quality "$qualite" "$cible"
  else
    # Redimensionne le côté le plus long, sans jamais agrandir
    local largeur hauteur
    largeur=$(identify -format "%w" "$source[0]")
    hauteur=$(identify -format "%h" "$source[0]")
    if [ "$largeur" -ge "$hauteur" ] && [ "$largeur" -gt "$taille" ]; then
      cwebp -quiet -metadata none -q "$qualite" -resize "$taille" 0 "$source" -o "$cible"
    elif [ "$hauteur" -gt "$largeur" ] && [ "$hauteur" -gt "$taille" ]; then
      cwebp -quiet -metadata none -q "$qualite" -resize 0 "$taille" "$source" -o "$cible"
    else
      cwebp -quiet -metadata none -q "$qualite" "$source" -o "$cible"
    fi
  fi
}

total=0
# Toutes les photos, sauf : dossiers opti/, logo et favicons
while IFS= read -r -d '' photo; do
  dossier=$(dirname "$photo")
  nom=$(basename "$photo"); nom="${nom%.*}"
  mkdir -p "$dossier/opti"
  for spec in "800:78" "2000:82"; do
    taille="${spec%%:*}"; qualite="${spec##*:}"
    cible="$dossier/opti/$nom-$taille.webp"
    if [ "$FORCE" = 1 ] || [ ! -f "$cible" ]; then
      convertir "$photo" "$cible" "$taille" "$qualite"
      echo "  ✓ $cible"
      total=$((total + 1))
    fi
  done
done < <(find "$DOSSIER" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) \
           -not -path '*/opti/*' -not -iname 'logo*' -not -iname 'favicon*' -not -iname 'apple-touch-icon*' -print0)

echo "Terminé : $total image(s) créée(s)."
echo "N'oublie pas : IMAGES_OPTIMISEES = true dans medias.js."
