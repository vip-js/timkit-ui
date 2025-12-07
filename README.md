# Timkit UI (Monorepo)

**基于 Tailwind CSS v4 的现代化、多框架企业级 UI 组件库。**

> 💡 **核心理念**: Timkit UI 融合了两种模式的优势：
> 1.  **Registry 模式** (推荐): 类似 shadcn/ui，直接分发源代码，拥有极致的定制自由度。
> 2.  **Package 模式**: 传统的 NPM 包模式 (`@timui/react`)，适合快速集成和标准使用。

---

## 🌟 核心特性

-   **🎨 Tailwind CSS v4**: 拥抱最新技术栈，提供极致的性能与开发体验。
-   **📦 Registry-First**: 所有组件在 `apps/docs/registry` 中维护，天然支持 Copy-Paste。
-   **🧩 双模消费**: 既可以通过 CLI 下载源码，也可以通过 NPM 安装包。
-   **🌐 多框架支持**:
    -   **React**: 完美支持 Next.js (RSC)。
    -   **Vue**: 基于 `radix-vue` 的无障碍实现。
    -   **小程序**: 原生微信小程序支持。
-   **🛠️ 强大的 CLI**: 一键初始化，一键下载组件。

---

## 🚀 快速上手

### 方式一：Registry 模式 (推荐)

这种方式将组件 **源代码** 下载到你的项目中，你可以随意修改它们以适应业务需求。

1.  **初始化项目**
    ```bash
    npx timkit init
    ```
    *自动配置 Tailwind CSS v4、安装依赖并生成组件配置文件。*

2.  **添加组件**
    ```bash
    npx timkit add button dialog
    ```

### 方式二：Package 模式

传统的 NPM 库引用方式，适合不需要修改组件源码的场景。

1.  **安装依赖**
    ```bash
    pnpm add @timui/react
    ```

2.  **引入使用**
    ```tsx
    import { Button } from '@timui/react'
    
    export default () => <Button>Click me</Button>
    ```

---

## 🛠️ 本地开发指南

如果你想参与 Timkit UI 的开发，或者在本地运行文档站，请遵循以下流程。

### 环境要求

-   **Node.js**: >= 18
-   **pnpm**: >= 9 (本项目使用 pnpm workspace 管理)

### 版本要求 (硬性)

-   React 19 / React DOM 19
-   Tailwind CSS v4（v3 用户需参考 `docs/tokens.md` 兼容指引）
-   Node.js 18+（CI/CD 请同步升级）

### 快速启动

1.  **安装依赖**
    ```bash
    pnpm install
    ```

2.  **构建注册表数据 (关键步骤)**
    文档站依赖生成的 JSON 数据运行。**初次启动或修改组件代码后，必须运行此命令！**
    ```bash
    pnpm registry:build:all
    ```
    *看到 "Generated registry-all.json" 表示成功。*

3.  **启动开发服务器**
    ```bash
    pnpm dev
    ```
    访问 [http://localhost:3000](http://localhost:3000) 查看文档站。

### 常用命令

| 命令 | 说明 | 备注 |
| :--- | :--- | :--- |
| `pnpm registry:build:all` | **构建注册表全量数据** | **开发必跑**。将源码转换为 JSON 供文档站和 CLI 使用。 |
| `pnpm dev` | 启动文档站开发服务 | 默认端口 3000。 |
| `pnpm build` | 构建整个 Monorepo | 包括文档站、React 包等。 |
| `pnpm release:react` | 发布 @timui/react | 构建并发布 React 包到 NPM。 |
| `pnpm lint` | 代码风格检查 | |
| `pnpm typecheck` | 类型检查 | |

### 发布 @timui/react (NPM 模式)

- 包已移除 `private` 标记，并设置 `publishConfig.access=public`。
- 本地发布：`pnpm release:react`（构建后执行 `pnpm publish`）。
- CI 发布：`.github/workflows/release-react.yml`，支持手动触发或推送 `react-v*` tag，需配置 `NPM_TOKEN`。

---

## 📂 项目架构与结构

本项目采用 **Monorepo** 架构，核心是 **"Registry-as-Source" (注册表即源码)** 的设计模式。

### 目录结构

| 路径 | 类型 | 说明 |
| :--- | :--- | :--- |
| **`apps/docs`** | App | **文档站点**。同时作为 "Dogfooding" 环境，直接消费 Registry 组件。 |
| **`apps/docs/registry`** | Source | **核心源码**。所有组件 (UI/Hooks) 的单一事实来源 (Single Source of Truth)。 |
| **`packages/react`** | Package | **React 发行包**。内容完全同步自 Registry，提供给 NPM 用户使用。 |
| **`packages/core`** | Package | **核心定义**。包含 Schema 定义 (Zod) 等通用契约。 |
| **`packages/shared`** | Package | **共享逻辑**。包含 Tailwind 配置、工具函数等。 |
| **`packages/cli`** | Package | **命令行工具**。`npx timkit` 的源码。 |
| **`packages/vue`** | Package | **Vue 组件源**。 |
| **`packages/weapp`** | Package | **小程序组件源**。 |

### 架构说明 ("Dogfooding")

为了保证代码质量，`apps/docs` 采用了 "Dogfooding" (吃狗粮) 策略：

1.  **开发**: 开发者直接在 `apps/docs/registry/default` 下修改组件代码。
2.  **验证**: 文档站通过 `tsconfig` 路径映射，直接引用 Registry 中的源码进行渲染和测试。
3.  **同步**: 通过自动化脚本，Registry 中的代码会被同步到 `packages/react` 并发布，确保 CLI 用户和 NPM 用户获取到的代码完全一致。

---

## 🤝 参与贡献

欢迎提交 PR！

1.  Fork 本仓库并 clone 到本地。
2.  创建新分支 (`git checkout -b feature/NewComponent`)。
3.  在 `apps/docs/registry/default/ui` 下添加或修改组件。
4.  运行 `pnpm registry:build:all` 更新数据。
5.  在 `apps/docs` 中预览变更。
6.  提交 PR。

---

## 📄 License

MIT © [Timkit UI](https://github.com/timkit-ui)
