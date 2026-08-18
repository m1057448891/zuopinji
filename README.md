# MOSATO SAKAI · 个人作品集

AI 视觉创作者 · 内容运营 · AIGC 工作流

暗色系、克制的高级科技感个人作品集网站，展示 AIGC 图片、动态影像、风格效果与 AI 工具化工作流。使用 React + Vite 构建。

## 在线预览

<https://m1057448891.github.io/zuopinji/>

## 技术栈

- React 18 / Vite
- GSAP / Motion / Lenis（动效与滚动）
- 原生 CSS 设计系统
- 部署：GitHub Pages / EdgeOne

## 本地运行

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build     # 产物在 dist/
pnpm preview
```

## 项目结构

- `src/components` —— 各页面区块组件
- `src/data` —— 作品与内容数据
- `public` —— 站点静态资源
- `scripts` —— 素材同步与视觉检查脚本

## 说明

- 图片、视频等大媒体文件不进入 Git，由 `scripts/copy-assets.ps1` 同步并生成清单（`src/data/works.json`），部署时由 CDN 提供。
