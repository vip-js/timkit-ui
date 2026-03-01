---
name: timui
description: 在 Timkit UI monorepo 中执行前端组件库迭代开发（新组件、跨框架对齐、修复与重构、registry 同步、发布前质量检查）时使用。适用于需要同时理解 @timui/core、react/vue/html/weapp 包架构与统一设计模式，并产出可合入代码与规范化变更的场景。
---

# Timkit UI Frontend Iteration Skill

按以下顺序执行，除非用户明确指定范围。

## 1. 建立变更边界

- 先确认目标属于哪类任务：`新增组件`、`现有组件增强`、`跨框架补齐`、`样式/令牌调整`、`registry/CLI 同步`。
- 先查 `packages/core/src/components/<component>/` 是否已有 `schema.ts`、`props.ts`、`variants.ts`、`machine.ts`。
- 若是行为组件（交互状态依赖 Zag），先从 `@timui/core` 入手；若是纯展示组件，优先处理 `variants + schema + framework 结构对齐`。

## 2. 遵循单一事实来源（SSOT）

- 把 `@timui/core` 作为组件契约源：
  - `schema.ts` 定义 UCS 元数据与平台支持。
  - `props.ts` 定义跨框架类型契约。
  - `variants.ts` 定义 CVA 变体和默认值。
  - `machine.ts`（若存在）导出 Zag machine/connect/anatomy。
- 不在 framework 包中重新定义冲突契约。

## 3. 按框架实现薄适配

- React：
  - 使用 `forwardRef`、`data-slot`、`cn(...)`、`<component>Variants(...)`。
  - 事件桥接同时兼容 `onClick` 与 `onPress`（使用 `createTimEvent` 的既有模式）。
- Vue：
  - 使用 `script setup` 与 `provide/inject` 传递 machine 上下文。
  - 保持与 React 同名语义结构（root/trigger/content 等）。
- HTML：
  - 默认提供静态模板；仅在必要时提供轻量 adapter（如 `accordion.adapter.js`）。
- Weapp：
  - 遵循每组件目录四件套：`.json/.ts/.wxml/.wxss`。

## 4. 保持跨端结构一致

- 统一 `data-slot` 命名，避免同组件跨端语义漂移。
- `variant/size/state` 只改变样式表达，不改变语义层级。
- 新增 slot 或子部件时，先更新 core schema，再同步到各端。

## 5. 做最小充分验证

- 对改动包至少运行：
  - `pnpm --filter <pkg> run lint`（若该包有 lint 脚本）
  - `pnpm --filter <pkg> run typecheck`（若该包有 typecheck 脚本）
- 涉及跨包或导出改动时，额外运行：
  - `pnpm lint`
  - `pnpm typecheck`
- 涉及 registry 资产时，运行：
  - `pnpm registry:build:all`

## 6. 输出结果

在交付中固定说明：

- 改动文件与原因（core vs framework 的职责分配）
- 跨框架一致性策略
- 运行过的校验命令与结果
- 尚未覆盖的风险点

## 参考资料

- 架构：`references/architecture.md`
- 设计模式：`references/design-patterns.md`
- 编码规范：`references/coding-standards.md`
