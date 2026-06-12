<#
.SYNOPSIS
  Production image pipeline for the SOAR CNC site (and reusable for any client).

.DESCRIPTION
  Implements the standing image rules:
   1. Preserves the original in a backup folder (never served).
   2. Converts JPG/JPEG/PNG to WebP (quality 82, metadata stripped).
   3. Generates responsive widths: 400, 800, 1600, 1920 (skips sizes larger than the source — no upscaling).
   4. Maintains aspect ratio. SEO-friendly output names: <name>-<width>.webp
   6/7/8. Emits a ready <picture>/srcset snippet for you to paste (lazy by default).

.PARAMETER InputPath
  Path to the source image (jpg/jpeg/png).

.PARAMETER Name
  SEO-friendly base filename (kebab-case, no extension), e.g. "cnc-turning-precision-part".

.PARAMETER Hero
  Include the 1920px hero width.

.EXAMPLE
  ./optimize-images.ps1 -InputPath ..\source-materials\originals\turning.jpg -Name cnc-turning -Hero
#>
param(
  [Parameter(Mandatory=$true)] [string]$InputPath,
  [Parameter(Mandatory=$true)] [string]$Name,
  [switch]$Hero,
  [string]$OutDir   = "$PSScriptRoot\..\src\assets\images",
  [string]$BackupDir = "$PSScriptRoot\..\source-materials\originals",
  [int]$Quality = 82
)

$ErrorActionPreference = "Stop"

$magick = (Get-Command magick -ErrorAction SilentlyContinue).Source
if (-not $magick) { $magick = (Get-ChildItem "C:\Program Files\ImageMagick*\magick.exe" -ErrorAction SilentlyContinue | Select-Object -First 1).FullName }
if (-not $magick) { throw "ImageMagick (magick.exe) not found. Install it, then re-run." }

if (-not (Test-Path $InputPath)) { throw "Input not found: $InputPath" }
New-Item -ItemType Directory -Force -Path $OutDir, $BackupDir | Out-Null

# 1. Preserve original backup
$backup = Join-Path $BackupDir ([IO.Path]::GetFileName($InputPath))
Copy-Item $InputPath $backup -Force
Write-Output "backup -> $backup"

# Source width (don't upscale beyond it)
[int]$srcW = (& $magick identify -format "%w" $InputPath)
$targets = 400,800,1600
if ($Hero) { $targets += 1920 }
$targets += [Math]::Min($srcW,1920)              # 9: cap largest served at 1920 (never the raw original)
$generated = @()

foreach ($w in ($targets | Sort-Object -Unique)) {
  if ($w -gt $srcW) { continue }                 # 3/11: no upscaling, keep aspect ratio
  $out = Join-Path $OutDir "$Name-$w.webp"
  & $magick $InputPath -strip -resize "${w}x" -quality $Quality -define webp:method=6 $out  # 2/4/5
  $generated += [pscustomobject]@{ w=$w; file="$Name-$w.webp" }
  Write-Output ("  {0,5}px -> {1} ({2} KB)" -f $w, "$Name-$w.webp", [math]::Round((Get-Item $out).Length/1KB))
}
# Always include a capped-largest if source smaller than smallest target
if ($generated.Count -eq 0) {
  $out = Join-Path $OutDir "$Name-$srcW.webp"
  & $magick $InputPath -strip -quality $Quality -define webp:method=6 $out
  $generated += [pscustomobject]@{ w=$srcW; file="$Name-$srcW.webp" }
}

# 6/7/8: emit a paste-ready responsive snippet
$largest = ($generated | Sort-Object w | Select-Object -Last 1).file
$srcset  = ($generated | Sort-Object w | ForEach-Object { "/assets/images/$($_.file) $($_.w)w" }) -join ", "
Write-Output ""
Write-Output "Paste-ready <img> (gallery / content):"
Write-Output "<img src=`"/assets/images/$largest`" srcset=`"$srcset`" sizes=`"(max-width: 680px) 100vw, 50vw`" width=`"800`" height=`"AUTO`" loading=`"lazy`" decoding=`"async`" alt=`"DESCRIBE ME`">"
