# Timkit UI 架构速查

## Monorepo 分层

- `apps/docs`：文档站与 registry 源文件消费方。
- `packages/core`：组件契约与逻辑中心（schema/props/variants/machine/shared）。
- `packages/react`：React 组件实现与 hooks。
- `packages/vue`：Vue 组件实现。
- `packages/html`：静态 HTML 模板与少量 adapter。
- `packages/weapp`：微信小程序组件实现。
- `packages/tokens`：设计令牌输出。
- `packages/cli`：CLI 分发工具。

## 核心依赖关系

- framework 包依赖 `@timui/core`。
- `@timui/core` 聚合 Zag.js machine 与共享样式工具。
- 顶层通过 Turbo + pnpm workspace 编排构建、lint、typecheck、test。

## 组件数据流（目标模式）

1. core 定义契约（schema/props/variants/machine）。
2. React 作为主要参考实现。
3. Vue/HTML/Weapp 对齐语义结构与事件行为。
4. registry 构建脚本汇总产物到 `registry-all.json` 并供 docs/CLI 消费。

## 文件定位建议

- 契约与逻辑：`packages/core/src/components/<component>/`
- React：`packages/react/src/components/ui/<component>.tsx`
- Vue：`packages/vue/src/components/**/<component>*.vue`
- HTML：`packages/html/src/components/<component>.html`
- Weapp：`packages/weapp/src/<component>/`
