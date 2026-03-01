---
name: timui-component-architecture
description: 使用统一的 Zag.js 核心与轻量框架适配层，实现 Timkit UI 组件在 React/Vue/Weapp/HTML 的一致 API、结构与事件。
---

# Timkit UI 组件架构（Zag.js）

## 目标

构建跨端组件，使行为、属性与结构在 React、Vue、Weapp、HTML 之间保持一致。以 Zag.js 状态机为唯一事实来源，平台层仅做薄适配。
同时满足现代高可用、高复用、多形态组件规范：**结构稳定、语义清晰、样式可组合、内容可插拔**。

## 输入

- **核心机**：`@timui/core` 对每个组件导出 `*Machine`、`*Connect`、`*Api`。
- **基准实现**：React 端实现位于 `packages/react/src/components/ui/`。

## 输出要求

- 各端公共 API 保持一致：
  - 框架适配层应完整映射 Zag 机的 props。
  - 受控/非受控行为一致（`value` + `defaultValue`）。
  - 框架事件与机回调 1:1 对齐（如 `onValueChange`）。
- 多形态与可复用性规范：
  - 组件 统一的props定义。
  - 组件 **不内置业务内容**，内容通过 `children/slot` 注入。
  - 结构层（Root/Title/Description/Actions 等）清晰拆分。
  - `variant/size/state` 仅影响样式，不改变语义结构。
  - 提供稳定的插槽/子组件 API，避免在 demo 中写死结构。
- 结构一致性：
  - 使用一致的 `data-slot` / `data-state` 命名。
  - Trigger/Content 的 ARIA 关系与机的要求一致。
  - 保持跨端 DOM/模板层级对齐（用于一致样式与可访问性）。

## 工作流

1. **React（基准）**
   - 使用 `useMachine(*Machine, props)` + `*Connect`。
   - 规范化受控/非受控输入后传入机。
   - 通过 Context 向子部件提供 `api`。
   - 使用 Zag `mergeProps` 合并事件与属性。

2. **Vue**
   - 与 React 同一套 props；支持 `type` 和 `multiple`（若冲突以 `type` 为准）。
   - 使用 `useMachine(*Machine, computedProps)` + `*Connect`。
   - 使用强类型的 Context key 传递 `api`。
   - 将机回调映射到 Vue emits（`update:modelValue`、`change`）。

3. **Weapp**
   - 使用标准化机器适配层（组件内不写业务逻辑）。
   - 触发与 React/Vue 相同的机事件。
   - 以机 context 为唯一状态源，更新自身并同步子节点。

4. **HTML**
   - **静态版**：仅提供结构，无 JS。
   - **可选适配**：用最小 JS 初始化机并同步
     `data-state`、`aria-expanded`、`hidden`。
   - 与 React/Vue 保持一致的数据属性结构。

## 多形态组件设计准则（必须遵守）

- **内容注入优先**：所有文字、图标、操作按钮通过 `children/slot` 传入。
- **结构清晰**：拆分 Root/Title/Description/Actions/Icon 等语义层。
- **样式即配置**：通过 `variant/size` 驱动样式，不改变结构。
- **扩展不破坏**：新增形态通过组合子组件实现，而非修改内部逻辑。
- **跨端一致**：React/Vue/Weapp/HTML 保持同名 slot/子组件语义。

## 检查清单

- 所有端使用一致的 `data-slot` 和 `data-state` 语义。
- 每个组件行为与 React 基准一致。
- 受控/非受控逻辑正确。
- 平台层只做适配，无额外业务逻辑。
- 内容可插拔，demo 不内置业务文案。
- 结构稳定，跨端层级一致。

## 参考

- React 基准：`packages/react/src/components/ui/`
- Vue 适配：`packages/vue/src/components/`
- Weapp 适配：`packages/weapp/src/`
