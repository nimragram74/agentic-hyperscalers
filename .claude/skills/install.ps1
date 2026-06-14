<#
  Installs the team Claude Code skills (motion-explainer, pdf-to-video) for the
  current user and their Python dependencies.

  Usage (from the repo root or anywhere):
      powershell -ExecutionPolicy Bypass -File .claude\skills\install.ps1

  What it does:
    1) Finds a working Python 3.10+ interpreter.
    2) pip-installs the required packages (proxy-friendly).
    3) Copies the skills into  %USERPROFILE%\.claude\skills  (user-level = every project).
#>
$ErrorActionPreference = "Stop"
$repoSkills = $PSScriptRoot
$dest = Join-Path $env:USERPROFILE ".claude\skills"
New-Item -ItemType Directory -Force $dest | Out-Null

Write-Host "== Finding a working Python (3.10+) ==" -ForegroundColor Cyan
$candidates = @("py -3.12", "py -3.11", "py -3.10", "py -3", "python", "python3")
$PY = $null
foreach ($c in $candidates) {
    try {
        $parts = $c.Split(" ")
        $ver = & $parts[0] $parts[1..($parts.Length-1)] -c "import sys;print('%d.%d'%sys.version_info[:2])" 2>$null
        if ($LASTEXITCODE -eq 0 -and $ver) {
            $mj, $mn = $ver.Split(".")
            if ([int]$mj -eq 3 -and [int]$mn -ge 10) { $PY = $c; Write-Host "  using: $c  (Python $ver)" -ForegroundColor Green; break }
        }
    } catch {}
}
if (-not $PY) { throw "No working Python 3.10+ found. Install Python 3.12 from python.org and re-run." }
$pyParts = $PY.Split(" ")
function Py { & $pyParts[0] $pyParts[1..($pyParts.Length-1)] @args }

Write-Host "`n== Installing Python packages ==" -ForegroundColor Cyan
Py -m pip install --disable-pip-version-check `
    --trusted-host pypi.org --trusted-host files.pythonhosted.org `
    Pillow numpy imageio-ffmpeg python-pptx PyMuPDF

Write-Host "`n== Copying skills to $dest ==" -ForegroundColor Cyan
foreach ($s in @("motion-explainer", "pdf-to-video")) {
    $from = Join-Path $repoSkills $s
    if (Test-Path $from) {
        Copy-Item -Recurse -Force $from (Join-Path $dest $s)
        Write-Host "  installed: $s" -ForegroundColor Green
    }
}

Write-Host "`nDone. Restart Claude Code; the skills are now available in every project." -ForegroundColor Cyan
Write-Host "Try:  /motion-explainer   or ask Claude to 'use the motion-explainer skill'."
