Add-Type -AssemblyName System.Drawing
$srcPath = Join-Path $PSScriptRoot "cinema.jpg"
$dstPath = Join-Path $PSScriptRoot "thumb.jpg"

if (Test-Path $srcPath) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $w = 320
    $h = [math]::Round(320 * ($srcImg.Height / $srcImg.Width))
    if ($h -gt 320) { $h = 320 }
    
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    
    $graph.DrawImage($srcImg, 0, 0, $w, $h)
    $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $graph.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
    Write-Host "Thumb created successfully!"
}
