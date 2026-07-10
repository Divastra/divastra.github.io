$root = "D:\Divastra Claude"
$port = 4321
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port"
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".woff2"= "font/woff2"
    ".json" = "application/json"
}
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $localPath = $req.Url.LocalPath

    # ── CORS preflight ──
    if ($req.HttpMethod -eq "OPTIONS") {
        $res.Headers.Add("Access-Control-Allow-Origin","*")
        $res.Headers.Add("Access-Control-Allow-Methods","GET,POST,OPTIONS")
        $res.Headers.Add("Access-Control-Allow-Headers","Content-Type")
        $res.StatusCode = 204; $res.Close(); continue
    }

    # ── POST /api/log  (analytics logger) ──
    if ($localPath -eq "/api/log" -and $req.HttpMethod -eq "POST") {
        try {
            $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $line = $reader.ReadToEnd().Trim()
            if ($line) {
                $logFile = Join-Path $root "divastra-log.ndjson"
                [System.IO.File]::AppendAllText($logFile, $line + "`n", [System.Text.Encoding]::UTF8)
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("OK")
            $res.ContentType = "text/plain"
            $res.Headers.Add("Access-Control-Allow-Origin","*")
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            $res.StatusCode = 500
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("ERR: $_")
            $res.ContentType = "text/plain"
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        $res.Close(); continue
    }

    # ── GET /api/analytics  (return structured data from log) ──
    if ($localPath -eq "/api/analytics" -and $req.HttpMethod -eq "GET") {
        $logFile = Join-Path $root "divastra-log.ndjson"
        $sessions = [System.Collections.ArrayList]::new()
        $chats    = [System.Collections.ArrayList]::new()
        $events   = [System.Collections.ArrayList]::new()
        if (Test-Path $logFile) {
            foreach ($line in [System.IO.File]::ReadAllLines($logFile, [System.Text.Encoding]::UTF8)) {
                if (-not $line.Trim()) { continue }
                try {
                    $e = $line | ConvertFrom-Json
                    switch ($e.type) {
                        "session" { [void]$sessions.Add($e) }
                        "chat"    { [void]$chats.Add($e) }
                        "event"   { [void]$events.Add($e) }
                    }
                } catch {}
            }
        }
        $result = [ordered]@{sessions=$sessions.ToArray();chats=$chats.ToArray();events=$events.ToArray()} | ConvertTo-Json -Depth 8 -Compress
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($result)
        $res.ContentType = "application/json"
        $res.Headers.Add("Access-Control-Allow-Origin","*")
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close(); continue
    }

    # ── POST /save-icon  (icon generator writes PNG files) ──
    if ($localPath -eq "/save-icon" -and $req.HttpMethod -eq "POST") {
        try {
            $body   = New-Object System.IO.StreamReader($req.InputStream)
            $json   = $body.ReadToEnd() | ConvertFrom-Json
            $name   = $json.name -replace '[/\\]',''          # sanitise
            $bytes  = [System.Convert]::FromBase64String($json.data)
            $dest   = Join-Path "$root\favicon" $name
            [System.IO.File]::WriteAllBytes($dest, $bytes)
            $msg    = [System.Text.Encoding]::UTF8.GetBytes("OK")
            $res.ContentType = "text/plain"
            $res.ContentLength64 = $msg.Length
            $res.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host "  saved favicon\$name"
        } catch {
            $msg = [System.Text.Encoding]::UTF8.GetBytes("ERR: $_")
            $res.StatusCode = 500
            $res.ContentType = "text/plain"
            $res.ContentLength64 = $msg.Length
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        $res.Close()
        continue
    }

    # ── GET static files ──
    if ($localPath -eq "/") { $localPath = "/index.html" }
    $filePath = Join-Path $root ($localPath.TrimStart("/").Replace("/", "\"))
    if (Test-Path $filePath -PathType Leaf) {
        $ext  = [System.IO.Path]::GetExtension($filePath)
        $mime = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $res.ContentType = $mime
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
    }
    $res.Close()
}
