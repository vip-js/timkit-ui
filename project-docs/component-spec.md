# Timkit UI 统一组件规范（Props / 样式 / 事件 / Slots）

本规范是跨端统一契约：React / Vue / Weapp / HTML 必须遵循同一套 Props、事件与结构语义。各端仅做适配，不允许自行扩展语义或逻辑。

## 统一原则

- **单一事实来源**：组件 API 与状态由 `@timui/core` + Zag.js 机定义。
- **结构稳定**：Root/Trigger/Content 等层级必须一致，避免跨端结构漂移。
- **样式可组合**：样式仅由 `variant/size/state` 驱动，不改变语义结构。
- **事件对齐**：事件名称与参数结构跨端一致（onXxx / update:modelValue / 事件冒泡）。
- **数据属性**：`data-slot`、`data-state`、`aria-*` 语义一致。

## 统一模板（每个组件都必须输出以下结构）

### 1) Props 规范

- **基础 Props**（所有组件必须支持）：
  - `id?`
  - `class?` / `className?`
  - `asChild?`（仅 Trigger/Link 类）
  - `disabled?`
  - `dir?`（如涉及方向）
  - `data-*` 透传（只读，禁止覆盖机生成的关键 data）

- **受控/非受控 Props**：
  - `value?` / `modelValue?`
  - `defaultValue?`
  - 对于开合类：`open?` / `defaultOpen?`

- **状态类 Props**（基于组件类型选择）：
  - `required?`
  - `multiple?` / `type?`
  - `collapsible?`
  - `orientation?`
  - `variant?`
  - `size?`

### 2) 事件规范

- **Value**：`onValueChange(value)` / Vue emits `update:modelValue`, `change`
- **Open**：`onOpenChange(open)` / Vue emits `update:open`, `change`
- **Select**：`onSelect(item)`（若机定义）
- **Focus/Blur/Keyboard**：仅透传，不改名
- **Weapp**：统一事件字段 `{ type, detail }`，detail 结构与 React/Vue 对齐

### 3) Slots / 子部件

- 必须定义稳定部件名：
  - Root / Trigger / Content / Item / Label / Icon / Indicator / Separator 等
- 允许通过 children/slot 插入任意内容，但不得改变部件层级
- 不内置业务文案；示例文案只存在于 demo

### 4) 样式规范

- **基础 class**：由组件实现提供默认 class
- **variant/size**：仅影响 class，严禁影响 DOM 结构
- **状态 class**：依赖 `data-state` / `data-disabled` / `aria-*`

### 5) Data 属性（强制）

- `data-slot="component-part"`
- `data-state="open|closed|checked|unchecked|active|inactive|disabled|"`
- `data-disabled="true|false"`（如适用）

### 6) ARIA 规范

- 必须根据 Zag 机产生的 aria props 透传
- Trigger/Content 关系必须存在（`aria-controls` / `aria-expanded`）

## 适配层约束

- **React**：使用 `useMachine` + `connect`，禁止绕过机直接改状态。
- **Vue**：使用 `useMachine` + `connect`，`modelValue` 与 `update:modelValue` 严格对齐。
- **Weapp**：使用 `createWeappMachine` 统一适配，状态只来自机。
- **HTML**：静态结构必须与 React/Vue 完全一致；可选 JS 适配需更新 `data-state`。

## 审核清单（每个组件对齐时必须通过）

- Props 定义与 React 基准一致
- 受控/非受控逻辑一致
- 事件名与参数结构一致
- `data-slot` 与 `data-state` 一致
- DOM 层级一致
- demo 不内置业务逻辑/数据
