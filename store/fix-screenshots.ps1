# Resize + strip alpha from screenshots for Chrome Web Store upload.
#
# Usage (from PowerShell):
#   cd store/screenshot
#   ..\fix-screenshots.ps1 *.png
#
# Writes fixed copies as <name>-1280x800.png alongside the originals.
# Target: 1280x800, 24-bit PNG, no alpha. Pads/crops to fit without distortion.

param(
    [Parameter(Mandatory=$true, ValueFromRemainingArguments=$true)]
    [string[]]$Files
)

Add-Type -AssemblyName System.Drawing

$targetW = 1280
$targetH = 800

foreach ($pattern in $Files) {
    foreach ($file in (Get-ChildItem $pattern)) {
        $inputPath = $file.FullName
        $outputPath = Join-Path $file.DirectoryName ("{0}-1280x800.png" -f [IO.Path]::GetFileNameWithoutExtension($file.Name))

        Write-Host "Processing: $($file.Name)"

        $src = [System.Drawing.Image]::FromFile($inputPath)
        try {
            $dst = New-Object System.Drawing.Bitmap $targetW, $targetH, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
            $g = [System.Drawing.Graphics]::FromImage($dst)
            try {
                $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

                # Fill white background (removes any transparency)
                $g.Clear([System.Drawing.Color]::White)

                # Preserve aspect ratio with letterbox/pillarbox fill
                $scale = [Math]::Min($targetW / $src.Width, $targetH / $src.Height)
                $newW = [int]($src.Width * $scale)
                $newH = [int]($src.Height * $scale)
                $x = [int](($targetW - $newW) / 2)
                $y = [int](($targetH - $newH) / 2)

                $g.DrawImage($src, $x, $y, $newW, $newH)
            }
            finally {
                $g.Dispose()
            }

            $dst.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
            $dst.Dispose()

            Write-Host "  -> $outputPath (1280x800, 24-bit)" -ForegroundColor Green
        }
        finally {
            $src.Dispose()
        }
    }
}

Write-Host "Done."
