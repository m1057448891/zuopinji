$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$srcWorks = 'G:\AI\作品集网站'
$srcPdf = 'G:\作品集文件\简历\简历\马中帅作品集.pdf'
$imgDir = Join-Path $root 'public\works\img'
$vidDir = Join-Path $root 'public\works\vid'
$docDir = Join-Path $root 'public\docs'
$jsonPath = Join-Path $root 'src\data\works.json'

New-Item -ItemType Directory -Force -Path $imgDir, $vidDir, $docDir | Out-Null

function Get-WorkTitle([string]$baseName) {
    if ($baseName -match '^jimeng-(\d{4})-(\d{2})-(\d{2})-(\d{4})-(.+)$') {
        $prompt = $Matches[5].Trim()
        $first = ($prompt -split '[，。]', 2)[0]
        $first = $first.Trim(' ', '-', '_', '·', '、', '.', '（', '）', '(', ')', '[', ']', '【', '】', '“', '”', '"', ':')
        if ($first -match '^(.{1,14})：(.+)$') {
            $prefix = $Matches[1].Trim()
            $rest = $Matches[2].Trim()
            if ($rest.Length -ge 6) { $first = $rest }
        }
        if ($first.Length -gt 30) { $first = $first.Substring(0, 30).TrimEnd() + '…' }
        return $first
    }
    if ($baseName -match '^[a-f0-9]{32,}') { return 'AI 概念视觉' }
    $title = $baseName
    if ($title.Length -gt 30) { $title = $title.Substring(0, 30) + '…' }
    return $title
}

function Get-WorkDate($file, [string]$baseName) {
    if ($baseName -match '^jimeng-(\d{4})-(\d{2})-(\d{2})') {
        return "$($Matches[1])-$($Matches[2])-$($Matches[3])"
    }
    return $file.LastWriteTime.ToString('yyyy-MM-dd')
}

$entries = @()
$imgIndex = 0
$vidIndex = 0

$files = Get-ChildItem -LiteralPath $srcWorks -File | Where-Object { $_.Extension -in '.png', '.mp4' } | Sort-Object Extension, Name

foreach ($file in $files) {
    $base = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $isVideo = $file.Extension -eq '.mp4'
    if ($isVideo) {
        $vidIndex++
        $newName = 'vid-' + $vidIndex.ToString('000') + '.mp4'
        $dest = Join-Path $vidDir $newName
        $url = '/works/vid/' + $newName
        $type = 'video'
    } else {
        $imgIndex++
        $newName = 'img-' + $imgIndex.ToString('000') + '.png'
        $dest = Join-Path $imgDir $newName
        $url = '/works/img/' + $newName
        $type = 'image'
    }

    Copy-Item -LiteralPath $file.FullName -Destination $dest -Force

    $entries += [ordered]@{
        id = "$type-$($(if ($isVideo) { $vidIndex } else { $imgIndex }).ToString('000'))"
        type = $type
        file = $url
        original = $file.Name
        title = Get-WorkTitle $base
        date = Get-WorkDate $file $base
    }
}

$json = @{ source = $srcWorks; generatedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'); works = $entries } | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText($jsonPath, $json, (New-Object System.Text.UTF8Encoding($false)))

if (Test-Path -LiteralPath $srcPdf) {
    Copy-Item -LiteralPath $srcPdf -Destination (Join-Path $docDir '马中帅作品集.pdf') -Force
}

# 首页背景视频优先使用剪辑练习目录中的最新版本
$heroVideoOverride = 'G:\视频剪辑\剪辑练习\0001-0150.mp4'
if (Test-Path -LiteralPath $heroVideoOverride) {
    Copy-Item -LiteralPath $heroVideoOverride -Destination (Join-Path $vidDir 'vid-001.mp4') -Force
    Write-Output 'Hero video overridden from G:\视频剪辑\剪辑练习\0001-0150.mp4'
}

# 首页轮播视频 1-5
$heroDir = Join-Path $root 'public\works\hero'
New-Item -ItemType Directory -Force -Path $heroDir | Out-Null
for ($i = 1; $i -le 5; $i++) {
    $srcHero = "G:\AI\作品集网站\$i.mp4"
    if (Test-Path -LiteralPath $srcHero) {
        Copy-Item -LiteralPath $srcHero -Destination (Join-Path $heroDir ("hero-0$i.mp4")) -Force
    }
}

Write-Output "Copied images: $imgIndex, videos: $vidIndex"
Write-Output "Works manifest: $jsonPath"
Write-Output "Manifest size: $((Get-Item $jsonPath).Length) bytes"
