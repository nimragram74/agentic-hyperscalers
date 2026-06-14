param(
    [Parameter(Mandatory = $true)][string]$TextFile,
    [Parameter(Mandatory = $true)][string]$OutWav,
    [string]$Voice = "Microsoft Zira Desktop",
    [int]$Rate = -1
)
# Offline text-to-speech using the Windows System.Speech engine (SAPI5).
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try { $synth.SelectVoice($Voice) } catch { Write-Warning "Voice '$Voice' not found; using default." }
$synth.Rate = $Rate
$synth.Volume = 100
$text = Get-Content -Raw -Encoding UTF8 $TextFile
$synth.SetOutputToWaveFile($OutWav)
$synth.Speak($text)
$synth.SetOutputToNull()
$synth.Dispose()
