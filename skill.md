# Timkit UI 技术架构文档

## 项目概述

Timkit UI 是一个基于 Tailwind CSS v4 的现代化、多框架企业级 UI 组件库，采用 **Registry-First** 设计模式，融合了 shadcn/ui 的"拥有代码"哲学和传统 NPM 包的便利性。

### 核心理念

- **Registry 模式**：直接分发源代码，提供极致的定制自由度
- **Package 模式**：传统 NPM 包模式，适合快速集成和标准使用
- **多框架统一**：一套设计语言，多端原生实现（React/Vue/Svelte/HTML/WeApp）
- **Zag.js 驱动**：统一使用 Zag.js 状态机，确保跨框架一致性

## 技术架构

### 1. 整体架构设计

项目采用 **Monorepo** 架构，基于 **"Registry-as-Source"** 的设计模式。

```
timkit-ui-monorepo/
├── apps/
│   └── docs/                    # 文档站点 (Next.js 15)
│       ├── registry/            # 组件源码注册表 (SSOT)
│       │   └── default/
│       │       ├── ui/          # React 组件
│       │       ├── vue/         # Vue 组件
│       │       ├── svelte/      # Svelte 组件
│       │       ├── html/        # HTML 模板
│       │       ├── weapp/       # 小程序组件
│       │       └── hooks/       # React Hooks
│       └── app/                 # Next.js App Router
├── packages/
│   ├── core/                    # 核心逻辑包（Zag.js 状态机 + 样式工具）
│   │   ├── schemas/             # Zod Schema 定义
│   │   └── machines/            # Zag.js 状态机导出
│   ├── tokens/                  # 设计令牌系统
│   ├── react/                   # React 发行包
│   ├── vue/                     # Vue 发行包
│   ├── svelte/                  # Svelte 发行包
│   ├── html/                    # HTML 发行包
│   ├── weapp/                   # 小程序发行包
│   └── cli/                     # CLI 工具
└── scripts/                     # 构建脚本
```

### 2. 核心技术栈

| 类别     | 技术                    | 说明             |
| -------- | ----------------------- | ---------------- |
| 前端框架 | React 19, Vue 3, Svelte | 多框架支持       |
| 构建工具 | Turbo, pnpm, tsup       | Monorepo 管理    |
| 样式系统 | Tailwind CSS v4         | 原子化 CSS       |
| 状态管理 | Zag.js                  | 统一跨框架状态机 |
| 类型系统 | TypeScript 5.8, Zod     | 严格类型         |
| 测试     | Vitest                  | 单元测试         |

### 3. 核心逻辑层架构

#### 3.1 统一使用 Zag.js 状态机

所有组件统一使用 Zag.js 官方状态机，确保：

- 一致的 API 设计
- 完整的可访问性支持
- 跨框架兼容性
- 官方维护和更新

#### 3.2 组件分类

| 分类     | 组件                                              | Zag.js 包                                                       |
| -------- | ------------------------------------------------- | --------------------------------------------------------------- |
| 基础交互 | Accordion, Collapsible, Tabs, Toggle Group        | @zag-js/accordion, collapsible, tabs, toggle-group              |
| 表单     | Checkbox, Radio, Switch, Slider, Select, Combobox | @zag-js/checkbox, radio-group, switch, slider, select, combobox |
| 弹层     | Dialog, Popover, Tooltip, Hover Card, Menu        | @zag-js/dialog, popover, tooltip, hover-card, menu              |
| 反馈     | Toast, Progress                                   | @zag-js/toast, progress                                         |
| 展示     | Avatar                                            | @zag-js/avatar                                                  |

### 4. 目录结构

```
packages/core/src/
├── index.ts              # 主入口，统一导出（包含所有 Zag.js 状态机 re-export）
├── schema.ts             # Registry Schema 定义
└── schemas/              # 组件 API Schema（Zod）
    ├── index.ts
    ├── button.ts
    └── ...
```

**说明：**

- 所有 Zag.js 状态机的 re-export 都直接在 `index.ts` 中，不再使用单独文件
- 这样更精简，减少了 18 个单独文件
- 保留了统一入口、命名统一、简化依赖的优点

````

### 5. 使用示例

#### React

```tsx
import { useMachine, normalizeProps } from '@zag-js/react'
import { accordionMachine, accordionConnect } from '@timui/core'

function Accordion() {
  const [state, send] = useMachine(accordionMachine({ id: 'accordion' }))
  const api = accordionConnect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      {items.map((item) => (
        <div key={item.value} {...api.getItemProps({ value: item.value })}>
          <button {...api.getItemTriggerProps({ value: item.value })}>
            {item.title}
          </button>
          <div {...api.getItemContentProps({ value: item.value })}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  )
}
````

#### Vue

```vue
<script setup>
import { accordionConnect, accordionMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'

const [state, send] = useMachine(accordionMachine({ id: 'accordion' }))
const api = computed(() => accordionConnect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-for="item in items" :key="item.value" v-bind="api.getItemProps({ value: item.value })">
      <button v-bind="api.getItemTriggerProps({ value: item.value })">
        {{ item.title }}
      </button>
      <div v-bind="api.getItemContentProps({ value: item.value })">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>
```

#### Svelte

```svelte
<script>
import { useMachine, normalizeProps } from '@zag-js/svelte'
import { accordionMachine, accordionConnect } from '@timui/core'

const [state, send] = useMachine(accordionMachine({ id: 'accordion' }))
$: api = accordionConnect($state, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  {#each items as item}
    <div {...api.getItemProps({ value: item.value })}>
      <button {...api.getItemTriggerProps({ value: item.value })}>
        {item.title}
      </button>
      <div {...api.getItemContentProps({ value: item.value })}>
        {item.content}
      </div>
    </div>
  {/each}
</div>
```

### 6. 导出结构

每个状态机模块导出：

```typescript
// 状态机工厂函数
export const xxxMachine = xxx.machine

// 连接函数（生成 API）
export const xxxConnect = xxx.connect

// 组件结构定义
export const xxxAnatomy = xxx.anatomy

// 类型定义
export type XxxApi = ReturnType<typeof xxx.connect>
export type XxxMachine = ReturnType<typeof xxx.machine>
export type XxxProps = Parameters<typeof xxx.machine>[0]
```

### 7. Zag.js 的优势

1. **跨框架**：同一套逻辑支持 React、Vue、Svelte、Solid
2. **可访问性**：内置完整的 ARIA 属性和键盘导航
3. **类型安全**：完整的 TypeScript 类型定义
4. **可测试**：状态机逻辑可独立测试
5. **官方维护**：由 Chakra UI 团队维护，持续更新

### 8. 设计系统层

**packages/tokens/**

- 基于 OKLCH 色彩空间的语义化设计系统
- 输出格式：CSS Variables、JSON、TypeScript、WXSS

**packages/core/**

- 通用工具函数 (`cn` 等)
- CVA 变体定义（buttonVariants, badgeVariants 等）
- 基础动画和过渡效果

### 9. 构建系统

#### 注册表构建流程

```
开发者修改 Registry 源码
    ↓
scripts/build-registry-all.ts 构建
    ↓
生成 registry-all.json
    ↓
文档站消费 + CLI 分发
```

### 10. 开发者体验

#### CLI 工具

```bash
npx timkit init              # 初始化项目
npx timkit add button dialog # 添加组件
npx timkit sync              # 同步更新
```

### 11. 发布策略

```bash
pnpm release:react   # 发布 React 包
pnpm release:vue     # 发布 Vue 包
pnpm release:html    # 发布 HTML 包
pnpm release:weapp   # 发布小程序包
```

### 12. 深入理解组件实现模式 (LLM 知识图谱)

本节总结了核心组件（以 Accordion 为例）的实现模式，供 AI Agent 和 LLM 参考，以便生成高质量、一致性的代码。

#### 12.0 Headless UI 抽象标准 (架构核心)

为了保证在 React, Vue, Weapp 三套框架中实现 100% 的逻辑复用与 UI 纯粹性，必须遵循严格的 Headless（无头组件）抽象标准：

1. **逻辑提纯 (Hooks & Context 隔离)**：所有交互逻辑（如 `useMachine` 实例化、状态派生）必须从视图组件（`.vue`, `.tsx`, `.ts`）中剥离，统一提取至独立的 `use-[component].ts` 文件中。
2. **强类型注入 (Strict Typing)**：框架间的状态分发禁止使用隐式泛型。Vue端必须使用强类型 Symbol 配合 `provide`/`inject`，React 端使用泛型约束的 `createContext`，从底层消除 `TS2742` 等声明断层。
3. **极简视图映射 (Dumb Presentational UI)**：UI 表现层仅仅作为逻辑钩子的「消费者」。视图只接受来自 Hook 的产物（如 `api.getRootProps()`）进行 DOM 绑定及 Variants 变体渲染，绝不内联处理复杂状态生命周期。

#### 12.1 架构数据流 (Architecture Data Flow)

所有组件均遵循严格的单向数据流和 Context 注入模式：

- **Machine Init**: 在根组件初始化 Zag.js 状态机 (`useMachine`)。
- **API Connect**: 将状态机状态和发送函数转换为易用的 API 对象 (`xxxConnect`)。
- **Context Injection**: 通过 React Context 将 `api` 对象向下传递给子组件。
- **UI Consumption**: 子组件 (`Item`, `Trigger`, `Content`) 从 Context 消费 `api` 并绑定 props。

**模式代码:**

```tsx
// 1. Machine & API
const service = useMachine(accordionMachine, { id, ... })
const api = accordionConnect(service, normalizeProps)

// 2. Context Provider
<AccordionContext.Provider value={{ api }}>
  {children}
</AccordionContext.Provider>

// 3. Child Consumption
const { api } = useContext(AccordionContext)
const itemProps = api.getItemProps({ value })
```

#### 12.2 状态管理与传递 (State Management Waterfall)

对于复合组件，状态往往需要多级传递。

- **Global Context**: 根组件提供全局 API (如 `AccordionContext`)。
- **Item Context**: 列表项组件提供局部状态 (如 `AccordionItemContext` 提供 `value`, `isOpen`, `disabled`)。
- **Derived State**: 子组件不需要重新计算状态，直接从 Context 读取 `isOpen` 等派生状态。

#### 12.3 属性处理 (Prop Handling)

为了保证 Zag.js 的可访问性逻辑不被覆盖，必须严格使用 `mergeProps`。

- **规则**: `mergeProps(apiProps, userProps)`
- **禁止**: 直接覆盖，例如 `{...apiProps} {...userProps}` 可能会导致事件处理函数丢失。
- **正确范式**:
  ```tsx
  const rootProps = api.getRootProps()
  const mergedProps = mergeProps(rootProps, props)
  return <div {...mergedProps} />
  ```

#### 12.4 样式驱动 (Styling via Data Attributes)

组件的状态样式完全由 Zag.js 自动管理的 `data-*` 属性驱动，避免手动 toggle class。

- **Open/Closed**: `data-state="open"` / `data-state="closed"`
- **Disabled**: `data-disabled`
- **Orientation**: `data-orientation="horizontal"`

**Tailwind 写法:**

```tsx
className={cn(
  // 基础样式
  'overflow-hidden text-sm transition-all',
  // 状态样式
  '[&[data-state=open]>svg]:rotate-180', // Trigger 旋转图标
  'data-[state=closed]:animate-accordion-up', // Content 动画
  'data-[state=open]:animate-accordion-down'
)}
```

#### 12.5 动画实现 (Animation Strategy)

动画通常绑定在 `data-state` 上，配合 CSS Keyframes。

- **定义**: 在 `tailwind.config.ts` 中定义 keyframes (`accordion-down`, `accordion-up`)。
- **应用**:
  ```tsx
  item.isOpen ? 'animate-accordion-down' : 'animate-accordion-up'
  ```
  或者直接依赖 data attribute:
  ```tsx
  'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
  ```

#### 12.6 组件插槽与标识 (Slots & Identity)

为了便于测试和定位，每个组件应包含 `data-slot` 属性。

- Example: `data-slot="accordion"`, `data-slot="accordion-trigger"`

## 总结

Timkit UI 通过统一使用 Zag.js 状态机，实现了：

1. **一致性**：所有组件使用相同的状态管理模式
2. **跨框架**：React、Vue、Svelte 共享同一套逻辑
3. **可访问性**：内置完整的 ARIA 和键盘导航支持
4. **类型安全**：完整的 TypeScript 类型定义
5. **易于维护**：依赖官方维护的 Zag.js 包
