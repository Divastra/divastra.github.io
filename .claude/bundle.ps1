$dir = "D:\Divastra Claude\divu"
$order = @(
  "divu.expressions.js",
  "divu.utils.js",
  "divu.config.js",
  "divu.styles.js",
  "divu.comments.js",
  "divu.look.js",
  "divu.face.js",
  "divu.bubble.js",
  "divu.body.js",
  "divu.voice.js",
  "divu.face-mimic.js",
  "divu.replies.js",
  "divu.classify.js",
  "divu.mischief.js",
  "divu.chat.js",
  "divu.intel.js",
  "divu.js"
)

$parts = [System.Collections.Generic.List[string]]::new()
$parts.Add("/* Divu — single-file bundle (works on file:// and http://) */`n(function(){'use strict';")

foreach ($file in $order) {
  $path = Join-Path $dir $file
  $raw = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
  $raw = [System.Text.RegularExpressions.Regex]::Replace($raw, '(?m)^import [^\r\n]+[\r\n]*', '')
  $raw = [System.Text.RegularExpressions.Regex]::Replace($raw, 'export ((?:async )?(?:function|const|let|var|class))\b', '$1')
  $parts.Add("`n/* ── $file ── */`n$raw")
}

$parts.Add("`n})();")
$bundle = [string]::Join('', $parts)
[System.IO.File]::WriteAllText("$dir\divu.bundle.js", $bundle, [System.Text.Encoding]::UTF8)
$kb = [math]::Round([System.IO.File]::ReadAllBytes("$dir\divu.bundle.js").Length / 1024)
Write-Host "divu.bundle.js rebuilt — ${kb} KB"
