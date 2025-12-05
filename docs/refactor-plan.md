# Timkit UI 重构与产品升级方案 (Master Plan)

**文档定位**：本项目不仅是代码重构，更是一次**产品维度的全面升级**。目标是将 Timkit UI 打造为**企业级设计工程化平台**，对标业界顶尖（shadcn/ui, Linear, Vercel）标准。

---

## 1. 产品愿景 (Product Vision)

**"The Ultimate Design Engineering Kit"**
为开发者和设计师提供一套**原生、原子化、多框架适配**的构建基石。不仅提供组件，更提供**设计系统**和**工程化标准**。

### 核心价值主张 (Value Proposition)
1.  **Copy-paste, but Better**: 保持 shadcn/ui 的"拥有代码"哲学，但提供更强大的 CLI 自动化和依赖管理。
2.  **Universal Design, Native Code**: 一套设计语言（Tokens/Schema），多端原生实现（React/Vue/Weapp），拒绝黑盒封装。
3.  **Enterprise Grade**: 默认集成可访问性 (A11y)、严格类型 (Strict TS)、暗色模式和国际化支持。

---

## 2. 设计系统重构 (Design System Refactoring)

### 2.1 设计哲学：Atomic & Semantic
从 `packages/tokens` 开始，构建完整的语义化设计系统，而非简单的颜色映射。

-   **基础层 (Primitives)**: 使用 OKLCH 色彩空间定义 `Palette` (e.g., `blue-500`).
-   **语义层 (Semantics)**:
    -   **Surface**: `bg-surface-default`, `bg-surface-subtle`, `bg-surface-overlay`.
    -   **Content**: `text-content-primary`, `text-content-secondary`, `text-content-tertiary`.
    -   **Border**: `border-default`, `border-divider`.
    -   **Interaction**: `action-hover`, `action-pressed`, `focus-ring`.
-   **组件层 (Component Tokens)**: (可选) `button-bg`, `input-border`，通过 CSS 变量映射到语义层。

### 2.2 视觉升级 (Visual Polish)
-   **微交互 (Micro-interactions)**: 所有交互组件必须包含 `enter`, `exit`, `hover`, `active` 状态的流畅过渡（参考 Linear）。
-   **排版节奏 (Typography & Rhythm)**: 严格遵循 4px 网格系统，字体排版采用流体缩放。
-   **图标体系**: 统一集成 Lucide 或 Remix Icon，并提供按需打包。

### 2.3 设计灵感与基准 (Design Inspiration & Benchmarks)
本项目将深度借鉴业界顶尖设计：

-   **shadcn/ui (The Philosophy)**:
    -   **Ownership**: 用户拥有代码，而非依赖黑盒包。
    -   **Radix Primitives**: 基于 Headless UI 构建，确保无障碍访问 (A11y) 和键盘导航。
    -   **Minimalism**: 默认样式极简，易于覆盖和扩展。

-   **Linear (The Craft)**:
    -   **Micro-interactions**: 按钮点击的缩放 (Scale)、弹窗的模糊 (Blur)、列表的交错动画 (Stagger)。
    -   **Density & Rhythm**: 高密度的信息展示，但通过严格的间距 (4px grid) 保持呼吸感。
    -   **Glow & Glass**: 巧妙使用光晕 (Glow effects) 和磨砂玻璃 (Backdrop blur) 提升质感，而非滥用阴影。
    -   **Typography**: 使用 Inter 或 Geist 字体，强调字重对比 (Font Weight Contrast) 来构建层级。

---

## 3. 技术架构重构 (Architecture Refactoring)

采用 **"Workspace-First"** 和 **"Schema-Driven"** 策略，确保工程的可维护性与扩展性。

### 3.1 目录结构 (Monorepo)
```text
/
├── pnpm-workspace.yaml  # Workspace Root
├── apps/
│   └── docs/            # 文档站 (Next.js, 消费 packages)
├── packages/
│   ├── core/            # Zod Schemas (API定义), Registry Types
│   ├── tokens/          # Design Tokens (SSOT: CSS Vars, JSON, TS)
│   ├── shared/          # Utils (cn), Animations, Reset
│   ├── web/             # React 实现 (Source Code)
│   ├── vue/             # Vue 实现
│   ├── weapp/           # 小程序实现 (WXML/WXSS)
│   └── cli/             # @timkit/cli (工程化入口)
└── scripts/             # Build & Registry Generation
```

### 3.2 通用层策略 (Universal Layer Strategy)
**"资产通用，逻辑原生，接口对齐"**

-   **Universal Assets**: Tokens, Icons, Utils 统一管理，多端复用。
-   **Universal Definition**: 使用 Zod Schema 定义组件 API (Props, Slots)，确保 React/Vue/小程序 接口一致。
-   **Native Implementation**: 各框架包 (`packages/web` 等) 编写原生代码，保证最佳性能和 SSR 支持。

### 3.3 严格工程标准 (Engineering Standards)
-   **Strict TypeScript**: 全局启用 `strict: true`，禁止 `any`，通过 `tsconfig.base.json` 强制执行。
-   **Linting & Formatting**: 统一 ESLint + Prettier 配置，Git Hooks 自动校验。
-   **Testing**: 单元测试 (Vitest) + 视觉回归测试 (Storybook/Chromatic)。

---

## 4. 开发者体验 (DX) 升级

### 4.1 魔法 CLI (`@timkit/cli`)
不仅仅是下载文件，更是工程化助手：
-   `npx timkit init`: 初始化配置，注入 Tailwind v4 插件和基础样式。
-   `npx timkit add <component>`: 智能分析依赖，下载代码，甚至支持 `--framework vue`。
-   `npx timkit sync`: (未来) 同步远程 Registry 更新，Diff 本地修改。

#### CLI 行为规范
- `npx timkit init`
  - 写入/合并 Tailwind v4 配置（含 tokens 变量、插件）。
  - 将 `packages/tokens/dist/theme.css`（或远程等价物）引入到全局样式。
  - 安装必需依赖（React/Vue/Svelte 对应框架、Radix 等）并检查 React 版本一致性。
- `npx timkit add <name> --framework <react|vue|svelte|html|weapp>`
  - 读取 `registry-all.json`，按框架提取文件落点（默认 `src/components` / 对应平台目录）。
  - 拉取/写入组件文件、必要的 shared 样式、hook、依赖提示（输出 “需安装 @radix-ui/... ”）。
  - 注入样式引用（如全局或局部引入 `@timkit/shared/button.css`）。
  - 失败策略：缺少组件/框架时打印建议，不改动文件系统。
- `npx timkit sync`
  - 对比本地与 registry 版本，生成 Diff 报告；提示需要手动合并的变更。
  - 可选：只更新 tokens 或特定组件。

### 4.4 统一预览组件规范
- 组件：`UnifiedPreview`（客户端），输入为 registry item（type: component|section，框架可用性，动态 import 路径）。
- 行为：
  - 动态 import 对应 React 组件或 MDX 预编译产物；对 Tree/高风险组件使用懒加载 + 错误边界。
  - 多框架代码切换：读取 registry 中的 code groups（React/Vue/Svelte/HTML/Weapp），统一用 Shiki 高亮。
  - 错误隔离：单个组件报错时渲染 fallback（提示跳转分类页预览），不影响其他卡片。
- 聚合页策略：
  - 默认只渲染快照/轻量预览；对特殊组件（Tree/headless-tree）保持客户端动态加载，避免 SSR Hook 冲突。
  - 统一卡片外观与交互（淡入、聚焦、复制按钮位置一致）。

### 4.2 沉浸式文档站
-   **Unified Preview**: 统一预览器，支持 React/Vue/HTML 实时切换。
-   **Interactive Playground**: 在线调整 Props，实时生成代码。
-   **Block Builder**: 可视化拼装 Section (Hero + Feature + Footer)，一键复制代码。

### 4.3 AI-Native Development
为 "AI 大模型开发" 优化项目结构，使其成为 AI 友好的代码库：
-   **Semantic Naming**: 严禁使用 `buttons-5fbbbed09f14.mdx` 这种无意义哈希文件名。所有文件必须语义化命名 (e.g., `hero-section-simple.tsx`)，便于 AI 推断内容。
-   **Context Generation**: 自动生成 `.cursorrules` 或 `project-context.md`，包含 Design Tokens 摘要、组件 Schema 定义和目录结构说明，帮助 AI Agent 快速理解项目上下文。
-   **Small Context Windows**: 保持组件文件短小精悍 (Single Responsibility)，避免巨型文件，降低 AI 上下文消耗。
-   **Explicit Typing**: 利用 Strict TS 提供强类型提示，帮助 AI 生成准确的 Props 代码。

---

## 5. 执行路线图 (Roadmap)

### Phase 0: 基座重塑 (Infrastructure)
- [ ] 建立标准 Pnpm Workspace 结构。
- [ ] 配置 Strict TS 和统一 Lint 规范。
- [ ] 迁移现有代码到 `apps/docs` 和 `packages/*`。

### Phase 1: 核心解耦 (Core Decoupling)
- [ ] 重构 `packages/tokens`：实现 OKLCH 语义化系统，输出 CSS/JSON/TS、`theme.wxss`。
- [ ] 提取 `packages/shared`：通用工具/动画/基础样式。
- [ ] 定义 `packages/core`：组件 Schema 标准 (props/slots/variants/interactions)。
- [ ] 实现 `scripts/build-registry-all.ts`：
  - 输入：`registry.json` + `componentsDB/**/*.mdx` + `core/schemas`。
  - 输出：`registry-all.json`（含类型、框架可用性、依赖、代码片段）、`catalog/catalog.all.json`。
  - 失败策略：缺文件/重复 name/无效 frontmatter 终止构建并打印报告。

### Phase 2: 组件标准化 (Standardization)
- [ ] 按照 Schema 重构 React 组件 (`packages/web`)。
- [ ] 实现 Unified Registry 构建脚本。
- [ ] 升级文档站预览引擎。

### Phase 3: 多端与生态 (Expansion)
- [ ] 适配 Vue/小程序 (`packages/vue`, `packages/weapp`)。
- [ ] 发布新版 CLI。
- [ ] 完善区块 (Blocks) 库。

---

## 6. 验收标准 (Success Metrics)
1.  **一致性**: React 与 Vue 组件 API 差异 < 5%；多框架 props/variants 对齐表发布。
2.  **性能**: 文档站 LCP < 1.5s，组件包体积 (Tree-shaken) 最小化；统一预览无崩溃。
3.  **效率**: CLI `npx timkit add button --framework react` 全流程 < 30s，自动注入 tokens/样式。
4.  **质量**: 0 TypeScript Errors，100% A11y Audit Pass，CI 包含 lint/typecheck/tokens build/registry build。

## 7. 关键产物清单
- 脚本：`scripts/build-registry-all.ts`、`scripts/build-tokens.ts`（如重命名）、CLI `packages/cli`.
- 数据：`registry-all.json`、`catalog/catalog.all.json`（含版本号、生成时间戳）。
- 包产物：`@timkit/tokens`（CSS/JSON/TS/WXSS）、`@timkit/shared`、`@timkit/web|vue|svelte|html|weapp`、`@timkit/cli`。
- 文档：组件/区块详情页（多框架代码切换）、安装指南、API 对齐表、常见问题。
