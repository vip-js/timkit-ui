# CLI & “Own the Code” 改造提案

保持 shadcn/ui 的“代码归你所有”理念，同时强化自动化与依赖管理，覆盖 React/Vue/WeApp/Svelte/HTML。

## 目标

- **代码落地可改**：所有生成文件直接写入项目，不依赖运行时远程拉取。
- **幂等 & 可重复**：多次执行不会破坏已有改动，可选择覆盖/跳过。
- **自动依赖管理**：安装组件时同步安装 npm 依赖/样式/配置。
- **多框架对齐**：同名组件跨框架共用 registry，CLI 自动选择目标框架模板。

## 命令设计

- `npx timkit init`
  - 检测包管理器、创建 `tailwind.config.ts`（v4 优先，v3 兼容）、注入 `timkitTailwindPreset`、生成基础 tokens 样式。
  - 写入 `.prettier`, `.eslintrc`（可选）。
- `npx timkit add <component> [--framework react|vue|svelte|html|weapp] [--path src/components/ui] [--yes]`
  - 从 `registry-all.json` 按框架读取文件，写入目标目录（默认 `components/ui`）。
  - 自动安装 deps/devDeps（可配置跳过），记录安装日志。
  - 处理样式注入：tailwind preset、tokens css、全局样式片段。
  - 幂等策略：若文件存在，提示覆盖/跳过/merge；支持 `--yes` 静默覆盖。
- `npx timkit list [--framework] [--tag]`
  - 列出可用组件/区块，显示框架可用性。
- `npx timkit doctor`
  - 检查 Tailwind 预设、tokens 注入、依赖版本、重复 React。

## 依赖与配置注入

- Tailwind v4：`presets: [timkitTailwindPreset]`，自动创建 `app/globals.css` 注入 tokens。
- Tailwind v3 兼容：在 `content` 添加路径，注入 preset。
- React：安装 `@timui/react` + Radix 依赖；Vue：`@timui/vue`；WeApp：`@timui/weapp`；Svelte/HTML：后续输出静态片段。

## 安全/可维护性

- 所有写入前备份 `.timkit/backup-<timestamp>/...`。
- 校验 registry 条目：缺内容即报错，保持“有源码才可用”。
- CLI 支持 `--registry <url>` 覆盖，方便内网或镜像。

## 后续工作（执行清单）

1. CLI：实现 init/add/list/doctor；加入依赖安装与样式注入。
2. Registry：完善跨框架同名组件、确保 `files.content` 完整。
3. 包：web/vue/weapp/svelte/html 入口与构建脚本，发布流程。
4. 文档：补充 CLI 手册、常见问题、v3/v4 配置示例。
