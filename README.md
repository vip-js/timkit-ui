# Timkit UI

**基于 Tailwind CSS v4 的现代化多框架企业级 UI 组件库 Monorepo。**

> 核心理念：用户**拥有代码**。组件以源码形式分发，无额外 npm 依赖，可任意修改。

---

## 目录

- [项目结构](#项目结构)
- [本地开发](#本地开发)
- [基础配置](#基础配置)
- [发布 npm](#发布-npm)
- [构建说明](#构建说明)
- [组件开发规范](#组件开发规范)
- [技术架构](#技术架构)

---

## 项目结构

```
timkit-ui/
├── apps/
│   ├── docs/                  # React 文档站（Next.js 15）
│   ├── docs-vue/              # Vue 文档站（Nuxt）
│   └── vue-preview-server/    # Vue 组件预览服务（Vite）
├── packages/
│   ├── core/                  # 核心逻辑层（@timui/core）
│   ├── react/                 # React 组件包（@timui/react）
│   ├── vue/                   # Vue 组件包（@timui/vue）
│   ├── cli/                   # 命令行工具（@timui/cli）
│   ├── html/                  # 原生 HTML 包（@timui/html）
│   ├── weapp/                 # 微信小程序包（@timui/weapp）
│   └── tokens/                # Design Tokens（@timui/tokens）
├── registry/
│   ├── react/                 # React 组件源码（零依赖）
│   └── vue/                   # Vue 组件源码（零依赖）
├── scripts/                   # 构建/发布/检查脚本
├── turbo.json                 # Turborepo 配置
└── pnpm-workspace.yaml        # pnpm workspace 配置
```

### 包版本

| 包名 | 版本 | 说明 |
|------|------|------|
| `@timui/core` | 0.0.1 | 核心状态逻辑、Schema、Variants |
| `@timui/react` | 0.0.1 | React 组件包 |
| `@timui/vue` | 0.0.1 | Vue 组件包 |
| `@timui/cli` | 0.0.1 | `npx timkit` CLI 工具 |
| `@timui/html` | 0.0.1 | 原生 HTML 版本 |
| `@timui/weapp` | 0.0.1 | 微信小程序版本 |

---

## 本地开发

### 环境要求

- **Node.js** ≥ 18
- **pnpm** ≥ 9（使用 pnpm workspace 管理）

### 首次启动

```bash
# 1. 克隆仓库
git clone https://github.com/timkit-ui/timkit-ui.git
cd timkit-ui

# 2. 安装所有依赖
pnpm install

# 3. 构建注册表数据（首次必须执行，文档站依赖此步骤）
pnpm registry:build:all

# 4. 启动开发服务器（同时启动 React 文档站 + Vue 预览服务）
pnpm dev
```

启动后访问：
- React 文档站：http://localhost:3000
- Vue 预览服务：http://localhost:5173（内嵌在 docs iframe 中）

### 常用开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动所有开发服务器（React docs + Vue preview） |
| `pnpm build` | 构建整个 Monorepo（Turborepo 增量构建） |
| `pnpm registry:build:all` | 重新生成 registry-all.json（修改组件源码后必须执行） |
| `pnpm typecheck` | 对所有包执行 TypeScript 类型检查 |
| `pnpm lint` | 对所有包执行 ESLint 检查 |
| `pnpm test` | 运行所有单元测试 |
| `pnpm format` | Prettier 格式化所有 `.ts`、`.tsx`、`.md`、`.json` |

### 单独启动某个应用

```bash
# 仅启动 React 文档站
pnpm -C apps/docs dev

# 仅启动 Vue 预览服务
pnpm -C apps/vue-preview-server dev

# 仅构建某个包
pnpm --filter @timui/react run build
```

### 注册表相关命令

```bash
# 全量构建（增量检测 + 生成报告）
pnpm registry:build:all

# 检查多端组件实现差距（哪些组件尚未支持某个框架）
pnpm registry:report

# 跨端一致性审计
pnpm audit:parity
```

---

## 基础配置

### tsconfig.base.json

根目录的 `tsconfig.base.json` 是所有包的 TypeScript 基础配置，各包通过 `"extends": "../../tsconfig.base.json"` 继承。

```json
// tsconfig.base.json（关键配置项）
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true
  }
}
```

### .npmrc

根目录 `.npmrc` 控制 pnpm 和 Node 的全局行为：

```ini
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*next*
public-hoist-pattern[]=*turbo*
# 给 tsup DTS 生成 worker 和 Next.js 构建提供足够内存
node-options=--max-old-space-size=4096
```

> ⚠️ `node-options=--max-old-space-size=4096` 是必要配置，`@timui/core` 有 230+ 个入口文件，DTS 生成时会消耗大量内存。

### turbo.json

Turborepo 的任务流配置。所有 `build` 任务的缓存输出：

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**",
        ".output/**",
        "**/*.tsbuildinfo"
      ]
    }
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 组件注册表配置（registry/react）

registry 组件是零依赖的源码。内联了以下工具库（不再依赖 npm）：

| 内联文件 | 替代的 npm 包 |
|----------|--------------|
| `registry/react/lib/clsx.ts` | `clsx` |
| `registry/react/lib/cva.ts` | `class-variance-authority` |
| `registry/react/lib/tailwind-merge.ts` | `tailwind-merge` |
| `registry/react/hooks/use-theme.ts` | `next-themes` |
| `registry/vue/lib/injection-keys.ts` | 替代 `inject<any>` 的类型化注入 |

---

## 发布 npm

### 准备工作

```bash
# 确保已登录 npm
npm whoami

# 如果未登录
npm login
```

### 构建 + 发布（推荐方式）

根目录提供便捷的发布脚本，会自动先构建再发布：

```bash
# 发布 @timui/react
pnpm release:react

# 发布 @timui/vue
pnpm release:vue

# 发布 @timui/html（原生 HTML）
pnpm release:html

# 发布 @timui/weapp（微信小程序）
pnpm release:weapp

# 同时发布所有包
pnpm packages:release
```

每个命令等价于：
```bash
pnpm --filter @timui/react run build && pnpm --filter @timui/react publish --access public --no-git-checks
```

### 发布单个包（手动）

```bash
# 以 @timui/core 为例
cd packages/core

# 1. 构建
pnpm build

# 2. 检查产物
ls dist/

# 3. 发布
pnpm publish --access public --no-git-checks
```

### 更新版本号

在发布前更新对应包的 `package.json` 中的 `version` 字段：

```bash
# 交互式更新（推荐）
cd packages/react
pnpm version patch   # 1.0.0 → 1.0.1
pnpm version minor   # 1.0.0 → 1.1.0
pnpm version major   # 1.0.0 → 2.0.0
```

### packages/core 构建说明（重要）

`@timui/core` 有 230+ 个入口文件，构建分两步，顺序不能颠倒：

```bash
# packages/core 的 build script（package.json 中）：
tsup && rm -f tsconfig.tsbuildinfo && tsc --emitDeclarationOnly --noEmit false
```

> **为什么要 `rm -f tsconfig.tsbuildinfo`？**
> tsup 的 `clean: true` 会清空 `dist/` 目录，但 `.tsbuildinfo` 文件仍然存在，导致 `--incremental` tsc 认为"无变化"而跳过生成 `.d.ts`。删除 `.tsbuildinfo` 强制 tsc 重新生成声明文件。

### packages/react 构建说明

```bash
# packages/react 的 build script：
tsup  # dts:true，含 DTS 生成（约 10-25s）
```

`tsup` 使用内置的 DTS worker 生成 `dist/index.d.ts`（约 50KB）。得益于 `.npmrc` 中的 `--max-old-space-size=4096`，worker 不会 OOM。

---

## 构建说明

### 增量构建

本项目用 **Turborepo** 管理 Monorepo 构建任务，通过内容哈希缓存：

```bash
pnpm build  # 第一次：全量构建；之后：仅构建变更部分
```

### 验收流程（CI）

```bash
# 快速验收（类型检查 + 代码检查 + 构建）
pnpm goal:ci:fast

# 完整验收（+ 集成测试）
pnpm goal:ci:full
```

### 常用质量命令

```bash
# 检查多端实现差距
pnpm registry:report

# 性能基准测试
pnpm goal:perf

# 完整验收（间距报告 + 一致性 + 性能）
pnpm goal:acceptance
```

---

## 组件开发规范

### 新增组件流程

1. **在 `packages/core/src/components/` 下创建核心逻辑**

   ```
   packages/core/src/components/my-component/
   ├── index.ts       # 统一导出
   ├── props.ts       # Props 类型定义
   ├── variants.ts    # CVA 样式变体
   ├── schema.ts      # Zod Schema
   └── machine.ts     # Zag.js 状态机（如需要）
   ```

2. **在 `registry/react/ui/` 下创建 React 组件**

   ```tsx
   // registry/react/ui/my-component.tsx
   import { cn } from '../lib/utils'
   import { cva } from '../lib/cva'          // 使用内联版本，非 npm
   import type { MyComponentProps } from '@timui/core'
   ```

3. **运行注册表构建**

   ```bash
   pnpm registry:build:all
   ```

4. **在文档站添加 Demo**

   在 `apps/docs/registry/default/example/` 下添加示例文件。

### Registry 组件规范

- **不依赖 npm 工具库**：只使用 `registry/*/lib/` 中的内联版本
- **Vue 组件使用 InjectionKey**：不使用 `inject<any>`，从 `lib/injection-keys.ts` 导入类型化的 key
- **类型安全**：不使用 `@ts-ignore` 或 `@ts-expect-error`

---

## 技术架构

```
用户 / 消费方
    │
    ├── npx timkit add button    →  Registry (源码)
    │                                registry/react/ui/button.tsx
    │                                registry/vue/ui/button.vue
    │
    └── pnpm add @timui/react    →  Package (npm 包)
                                     packages/react/dist/

核心层
    packages/core/               →  状态机 + Props 类型 + Variants
        @zag-js/*                →  无头状态机（唯一 npm 运行时依赖）
        class-variance-authority →  样式变体（内联到 registry，core 用 npm 版）
```

### Headless UI 抽象标准 (架构核心)

为了保证在所有（React, Vue, Weapp）框架中实现完全的交互逻辑复用与 UI 视图的纯粹性，目前 `timkit-ui` 采用了一套极其严格的 **Headless UI（无头组件）架构标准**：

1. **逻辑彻底提纯**：所有跨框架业务交互、组件生命周期派发（如 `useMachine` 初始化与状态推导）必须从原始表示层(`.vue`, `.tsx`, Weapp `.ts`)剥离至对应的独立 `use-[component].ts` Hook 与 Behavior。
2. **强类型上下文隔离**：组件树的状态下发杜绝使用弱类型的隐式转换。在 Vue 中利用 Typescript `Symbol` 作为 `provide`/`inject` 密钥；在 React 使用强泛型的 `createContext`，达到 100% DTS 类型声明的可移植性。
3. **极简表现层 (Dumb Components)**：UI 组件纯粹充当 Zag.js 无头逻辑产出（如 `api.getRootProps()`）的使用终端。视图代码仅包含原子级的 CSS/HTML 映射和变体声明 (`Variants`)，杜绝内联声明副作用或处理重度逻辑。

### 依赖策略

| 层级 | 规范 |
|------|------|
| `packages/core` | 可依赖 `@zag-js/*`、`zod`、`cva` 等（构建时打包） |
| `packages/react` | 仅依赖 `@timui/core`（peer: `react`、`@zag-js/react`） |
| `registry/react` | **零 npm 依赖**，工具函数全部内联到 `lib/` |
| `registry/vue` | **零 npm 依赖**，同上 |

---

## 许可证

MIT © [Timkit UI](https://github.com/timkit-ui)
