# Timkit UI

多框架 UI 组件库 Monorepo（React / Vue / Weapp / HTML），基于 **Tailwind CSS v4 + Zag.js**。

## 1. 仓库结构

```text
timkit-ui/
├─ apps/
│  ├─ docs/                # React 文档站（Next.js）
│  ├─ docs-vue/            # Vue 文档站（Nuxt）
│  └─ vue-preview-server/  # Vue 预览服务（Vite）
├─ packages/
│  ├─ core/    @timui/core
│  ├─ react/   @timui/react
│  ├─ vue/     @timui/vue
│  ├─ html/    @timui/html
│  ├─ weapp/   @timui/weapp
│  ├─ tokens/  @timui/tokens (private)
│  └─ cli/     @timui/cli (private)
├─ registry/              # 源码分发素材
├─ scripts/               # 构建/校验脚本
└─ tests/
```

## 2. 包与职责

| 包名            |    版本 | 状态        | 说明                                      |
| --------------- | ------: | ----------- | ----------------------------------------- |
| `@timui/core`   | `0.0.1` | publishable | 核心契约层：schema/props/variants/machine |
| `@timui/react`  | `0.0.1` | publishable | React 组件实现                            |
| `@timui/vue`    | `0.0.1` | publishable | Vue 组件实现                              |
| `@timui/html`   | `0.0.1` | publishable | 纯 HTML 分发包                            |
| `@timui/weapp`  | `0.0.1` | publishable | 微信小程序分发包                          |
| `@timui/tokens` | `0.0.1` | private     | 设计令牌产物                              |
| `@timui/cli`    | `0.0.1` | private     | CLI（`timui` / `timkit`）                 |

## 3. 本地开发

### 环境要求

- Node.js `>=18`
- pnpm `>=9`

### 首次启动

```bash
pnpm install
pnpm registry:build:all
pnpm dev
```

默认地址：

- docs: <http://localhost:3000>
- vue-preview: <http://localhost:5173>

## 4. 常用命令

```bash
# 全仓构建/检查
pnpm build
pnpm lint
pnpm typecheck
pnpm test

# 目标门禁（推荐发布前）
pnpm goal:acceptance:strict
pnpm goal:lint

# 生成 registry-all.json（组件源码变更后执行）
pnpm registry:build:all
```

## 5. 发布说明

### 发布前检查

```bash
npm whoami
pnpm release:peer-check
pnpm goal:acceptance:strict
pnpm goal:lint
```

### 单包发布

```bash
pnpm release:react
pnpm release:vue
pnpm release:html
pnpm release:weapp
```

### 批量发布

```bash
pnpm packages:release
```

## 6. 技术架构（简版）

- `@timui/core`
  - 维护统一组件名枚举与契约（schema/props/variants）
  - 暴露 Zag machine 与跨端共享工具
- `@timui/react` / `@timui/vue`
  - 通过 adapter/hook 连接 `@zag-js/*`
  - 负责框架渲染与交互封装
- `@timui/html` / `@timui/weapp`
  - 提供平台分发产物
- `registry-build`
  - 聚合多端源码与文档元数据，生成 `registry-all.json`
- `preview-runtime`（React / Vue / HTML）
  - 通过 `@timui/core/preview-protocol` 共享同一套 iframe 消息契约
  - 使用 `requestId + version` 做请求隔离与协议版本控制
  - 统一消息类型：`LOAD_PREVIEW / UPDATE_PROPS / PREVIEW_READY / PREVIEW_RENDERED / PREVIEW_FAILED`
  - 预览消息默认启用 origin 白名单校验，可通过 `NEXT_PUBLIC_PREVIEW_ALLOWED_ORIGINS` / `VITE_PREVIEW_ALLOWED_ORIGINS` 扩展
  - Vue 预览端支持 `VITE_PREVIEW_ALLOW_LEGACY=0` 关闭 legacy 通道（`LOAD_COMPONENT`）

## 7. 开发约定

- 新组件先落 `packages/core` 契约，再补 React/Vue/Weapp/HTML 实现。
- 提交前至少通过：
  - `pnpm goal:acceptance:strict`
  - `pnpm goal:lint`
- 组件源码改动后，记得执行：
  - `pnpm registry:build:all`

## 8. 许可证

[MIT](./LICENSE.md)
