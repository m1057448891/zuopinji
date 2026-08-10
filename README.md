# 马中帅 · 个人作品集

暗色系、克制的高级科技感个人作品集网站，React + Vite 实现，PC 端版心约 1700px。

## 运行

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # 产物在 dist/
pnpm preview
```

## 素材说明

- 网站引用的图片、视频由 `scripts/copy-assets.ps1` 从 `G:\AI\作品集网站` 复制到 `public/works/`，并生成 `src/data/works.json` 清单。
- 建筑学作品集 PDF 复制到 `public/docs/`。
- `public/works/` 与 `public/docs/` 已在 `.gitignore` 中忽略，仓库不携带大文件。

```powershell
powershell -ExecutionPolicy Bypass -File scripts/copy-assets.ps1
```

如果本机 Node 不在 PATH 中（例如使用 Codex 内置运行时），先执行：

```powershell
$env:Path = "C:\Users\A\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;" + $env:Path
```

## 视觉检查

`scripts/screenshot.cjs` 会用系统 Edge 对本地站点逐屏截图并输出控制台错误、资源 404、横向溢出等指标，截图存放在 `qa/`。

```powershell
node scripts/screenshot.cjs
```

## 待你确认的占位信息

- 联系电话：OCR 识别为 `158 4182 9472`，请核对（站点暂写作 +86 158 4182 9472）。
- 头像：暂用“MZ”文字肖像占位，可替换 `src/components/About.jsx` 中的头像卡片。
- 工作经历时间：简历图片未识别出明确时间段，时间线只写了“2023 — 至今”的教育阶段，其余条目未编造日期。
