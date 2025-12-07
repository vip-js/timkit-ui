# 组件 API 与可访问性基线

面向 React/Vue/Svelte/HTML/WeApp 统一的 API 约束，确保无障碍与一致性。

## 基本约定

- 受控优先：输入类组件支持 `value/onChange`（或等价的 `modelValue`/事件），提供 `defaultValue` 作为非受控入口。
- 状态与尺寸：`variant`、`size`、`disabled`、`loading` 为常见可选项，保持跨框架同名。
- 类名/样式：提供 `class`/`className`/`style` 扩展；支持 `data-slot` 方便选择器挂钩。
- 国际化：避免硬编码文案，暴露文本/aria-label props。

## 无障碍（A11y）

- 按钮/链接：必须有可见文本或 `aria-label`；禁用态用 `disabled`，避免只用样式。
- 表单控件：label 关联 `id`，提供 `aria-invalid`、`aria-describedby` 挂钩。
- 对话框/弹层：确保焦点管理（首选 Radix/Headless UI），暴露 `open/onOpenChange`；需要 `role="dialog"` 和 `aria-modal`。
- 列表/表格：提供键盘导航（上下左右/Tab），表格头部用 `<th>` 并带 `scope`。
- 动画：避免自动播放干扰，提供 `prefers-reduced-motion` 兼容。

## 行为/交互

- 受控/非受控：受控时不管理内部状态；非受控需暴露事件同步外部。
- 错误/校验：输入类支持 `invalid` 或 `error` 状态，渲染 aria 和视觉反馈。
- 组合组件：支持 `asChild`/`as` 或插槽模式，方便与路由/Link 集成。

## 多端差异

- Vue/Svelte/WeApp 需保持 prop 命名与 React 对齐（命名偏 kebab 的同时支持驼峰），行为一致；HTML 片段为纯静态示例，不含 JS。
- WeApp 提供 utils/wxss 保持与 Web 视觉一致，并在文档中标注限制。

## 文档要求

- 每个组件的 Props 表：必填项、默认值、类型、无障碍说明。
- 交互示例：聚焦、禁用、验证、异步加载等。
- 辅助信息：相关 tokens（颜色、半径、动效）、依赖库（如 Radix）。

> 后续迭代：完善深色/高对比度/密度支持，补充更细的键盘交互矩阵和屏幕阅读器测试用例。
