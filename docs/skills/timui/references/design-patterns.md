# Timkit UI 设计模式

## 1. UCS 契约模式（Core First）

- 使用 `defineUCS(...)` 定义组件元数据。
- 在 schema 中明确：`parts`、`logic.provider`、`props`、`slots`、`supportedPlatforms`。
- 新增交互组件优先设置 `logic.provider: 'zag'` 并绑定 machine 名称。

## 2. Machine 导出模式

- machine 文件导出统一命名：`<name>Machine`、`<name>Connect`、`<name>Anatomy`。
- props 类型从 Zag 类型导出或映射到 core `props.ts`，保持跨端一致。

## 3. Variants 样式模式

- 使用 `class-variance-authority` 维护变体。
- 使用 `cn()` 合并 className。
- `defaultVariants` 必填，避免端间默认值漂移。

## 4. React 组件结构模式

- 结构顺序：`type/props` -> `context/hook` -> `forwardRef component` -> `displayName/export`。
- 对组合组件使用 Context 在子组件间共享 machine 状态。
- 根节点与关键子节点写 `data-slot`，用于样式、测试、跨端比对。

## 5. Vue 适配模式

- `script setup` + typed `defineProps`。
- `provide/inject` 传递 machine 状态与 send。
- 用 `computed/watch` 同步状态，不把业务状态写死在模板中。

## 6. HTML / Weapp 模式

- HTML：模板优先，行为增强可选且最小化。
- Weapp：每个组件目录自包含结构、样式、逻辑、配置。

## 7. Registry-First 模式

- 组件应可被 registry 脚本发现并打包。
- 涉及 registry 文件时，确保路径与 target 映射可解析。
- 保持组件名称与导出名称稳定，避免 CLI 安装路径断裂。
