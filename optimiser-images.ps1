# =====================================================
#  OPTIMISER-IMAGES.PS1  (Windows, sans rien installer)
#  Crée, pour chaque photo .jpg des sous-dossiers de images/, deux copies allégées :
#    images/xxx/opti/NOM-800.jpg    (vignette, 800 px de côté max)
#    images/xxx/opti/NOM-2000.jpg   (grande, 2000 px de côté max)
#  Les originaux ne sont jamais modifiés. Les copies déjà créées sont gardées.
#
#  À lancer dans PowerShell, depuis le dossier du site :
#      powershell -ExecutionPolicy Bypass -File optimiser-images.ps1
#      powershell -ExecutionPolicy Bypass -File optimiser-images.ps1 -Force   (refait tout)
#
#  Dans medias.js : IMAGES_OPTIMISEES = true et FORMAT_OPTIMISE = "jpg".
#  (optimiser-images.sh fait la même chose en WebP, mais demande ImageMagick.)
# =====================================================
param([switch]$Force)
Add-Type -AssemblyName System.Drawing
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$racine = Join-Path $PSScriptRoot "images"

function Convertir($fichier, $cible, [int]$max, [long]$qualite) {
  $img = [System.Drawing.Image]::FromFile($fichier)
  try {
    # Applique l'orientation de l'appareil photo (photos verticales)
    if ($img.PropertyIdList -contains 0x0112) {
      switch ($img.GetPropertyItem(0x0112).Value[0]) {
        3 { $img.RotateFlip("Rotate180FlipNone") }
        6 { $img.RotateFlip("Rotate90FlipNone") }
        8 { $img.RotateFlip("Rotate270FlipNone") }
      }
    }
    $r = [Math]::Min([double]1, [double]$max / [Math]::Max($img.Width, $img.Height))
    $w = [int][Math]::Round($img.Width * $r); $h = [int][Math]::Round($img.Height * $r)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = "HighQualityBicubic"; $g.PixelOffsetMode = "HighQuality"; $g.CompositingQuality = "HighQuality"
    $g.DrawImage($img, 0, 0, $w, $h)
    $p = New-Object System.Drawing.Imaging.EncoderParameters 1
    $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, $qualite)
    $bmp.Save($cible, $codec, $p)
    $g.Dispose(); $bmp.Dispose()
  } finally { $img.Dispose() }
}

$n = 0
Get-ChildItem $racine -Recurse -Include *.jpg, *.jpeg |
  Where-Object { $_.Directory.Name -ne "opti" -and $_.DirectoryName -ne $racine } |
  ForEach-Object {
    $opti = Join-Path $_.DirectoryName "opti"
    New-Item -ItemType Directory -Force $opti | Out-Null
    foreach ($t in @(@{ px = 800; q = 78 }, @{ px = 2000; q = 80 })) {
      $cible = Join-Path $opti ("{0}-{1}.jpg" -f $_.BaseName, $t.px)
      if ($Force -or -not (Test-Path -LiteralPath $cible)) {
        Convertir $_.FullName $cible $t.px $t.q
        $n++
      }
    }
  }
"$n copie(s) créée(s)."
