# 设计令牌（Tokens）指南

面向多框架（React/Vue/Svelte/HTML/WeApp）的一致外观，通过 tokens 驱动。**默认以 Tailwind v4 为基座**，v3 可兼容性接入（见下方）。

## 基础层

- 颜色：`--color-*`（主色/语义色/中性色），来源 `packages/tokens`.
- 字体：`--font-sans`，`--font-mono`。
- 尺寸：`--radius`、`--border`、`--shadow-*`、`--space-*`。
- 动效：`--easing-*`、`--duration-*`。

## 别名层

- 语义别名：`--bg-surface`、`--bg-muted`、`--fg-muted`、`--fg-accent`、`--border-strong`。
- 组件别名：按钮、输入、卡片等在 shared 样式中引用别名，保证跨框架一致。

## 主题与模式

- 主题：默认浅色，可扩展深色/高对比；建议以 CSS variables 切换（`data-theme` 或 `class`）。
- 密度：支持舒展/紧凑两档，通过 `--space-*`、`--radius` 调整。

## 使用方式

1. 安装 `@timui/core`，引入 Tailwind v4 预设：`import { timkitTailwindPreset } from "@timui/core"`.
2. Tailwind v4（默认）：

   ```ts
   import { timkitTailwindPreset } from '@timui/core'
   import { defineConfig } from 'tailwindcss'

   export default defineConfig({
     presets: [timkitTailwindPreset], // v4-ready
   })
   ```

3. Tailwind v3 兼容（需开启旧版 content/transform）：保持同样的 preset 引入，并在 `content` 中包含你的文件；后续将提供 v3 专用转换包。
4. 原子化/内联：直接使用 CSS 变量，例如 `background: var(--bg-surface);`.

## 后续计划

- 丰富 tokens 列表并生成文档/可视化对照。
- 为暗色/高对比度提供完整 token 覆盖。
- 输出 Figma Variables 映射，保持设计到代码一致。
