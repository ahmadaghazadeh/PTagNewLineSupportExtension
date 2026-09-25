# Builds extension ZIP + CRX for docs/assets (run after changing manifest/content).
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$build = Join-Path $root "build"
$stage = Join-Path $build "pack-staging"
$key = Join-Path $build "extension.pem"
$legacyKey = Join-Path $build "pack-staging.pem"
if (-not (Test-Path $key) -and (Test-Path $legacyKey)) {
  Copy-Item $legacyKey $key
}
$assets = Join-Path $root "docs\assets"
$chrome = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"

if (-not (Test-Path $chrome)) {
  throw "Google Chrome not found at $chrome (needed for --pack-extension)."
}

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stage, $assets | Out-Null
Copy-Item "$root\manifest.json", "$root\content.js", "$root\content.css" -Destination $stage
Copy-Item "$root\icons" -Destination (Join-Path $stage "icons") -Recurse

$crxOut = Join-Path $build "pack-staging.crx"
$stagePem = Join-Path $stage "pack-staging.pem"
foreach ($f in @($crxOut, $stagePem)) {
  if (Test-Path $f) { Remove-Item $f -Force }
}
if (Test-Path $key) {
  & $chrome --pack-extension=$stage --pack-extension-key=$key 2>&1 | Out-Null
} else {
  & $chrome --pack-extension=$stage 2>&1 | Out-Null
  if (Test-Path $stagePem) {
    Move-Item $stagePem $key -Force
  }
}
Start-Sleep -Seconds 1
if (-not (Test-Path $crxOut)) { throw "CRX was not created." }

$zipPath = Join-Path $assets "PTagNewLineSupportExtension.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path @(
  (Join-Path $stage "manifest.json"),
  (Join-Path $stage "content.js"),
  (Join-Path $stage "content.css"),
  (Join-Path $stage "icons")
) -DestinationPath $zipPath -CompressionLevel Optimal

Copy-Item $crxOut (Join-Path $assets "PTagNewLineSupportExtension.crx") -Force
Write-Host "OK: $zipPath"
Write-Host "OK: $(Join-Path $assets 'PTagNewLineSupportExtension.crx')"
