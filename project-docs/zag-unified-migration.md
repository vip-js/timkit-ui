# 统一使用 Zag.js 状态机迁移方案

## 📋 目标

确保所有组件统一使用 Zag.js 官方状态机和官方 Hook，移除所有自定义实现。

---

## 🔍 当前状态分析

### ✅ 已完成

1. **所有组件状态机** - `packages/core/src/machines/` 下所有组件都使用 `@zag-js/*` 官方包
2. **Vue 组件** - 已正确使用 `@zag-js/vue` 的 `useMachine` ✅

### ❌ 需要修复

1. **React 组件** - 使用自定义 `useMachine` (`packages/react/src/hooks/use-machine.ts`)
2. **Svelte 组件** - 使用自定义 `useMachine` (`packages/svelte/src/lib/use-machine.ts`)
3. **文档不一致** - `architecture-issues.md` 中记录了"三层架构"，但实际已统一使用 Zag.js

---

## 🎯 迁移方案

### Phase 1: React 组件迁移

#### 1.1 更新所有 React 组件使用官方 Hook

**当前实现：**
```tsx
// packages/react/src/components/ui/accordion.tsx
import { useMachine } from '../../hooks/use-machine'  // ❌ 自定义实现
```

**目标实现：**
```tsx
// packages/react/src/components/ui/accordion.tsx
import { useMachine, normalizeProps } from '@zag-js/react'  // ✅ 官方 Hook
import { accordionMachine, accordionConnect } from '@timui/core'
```

#### 1.2 需要迁移的组件列表

检查所有使用自定义 `useMachine` 的组件：

```bash
# 查找所有使用自定义 useMachine 的文件
grep -r "from.*hooks/use-machine" packages/react/src/components
grep -r "from.*hooks/use-machine" apps/docs/registry/default/ui
```

**预计需要迁移的组件：**
- ✅ `accordion.tsx` - 需要迁移
- ✅ `collapsible.tsx` - 需要迁移
- ✅ `dialog.tsx` - 需要检查
- ✅ `checkbox.tsx` - 需要检查
- ✅ `switch.tsx` - 需要检查
- ✅ `select.tsx` - 需要检查
- ✅ 其他所有使用状态机的组件

#### 1.3 迁移步骤

**步骤 1：更新导入**
```tsx
// 旧代码
import { useMachine } from '../../hooks/use-machine'
import { accordionMachine } from '@timui/core'

// 新代码
import { useMachine, normalizeProps } from '@zag-js/react'
import { accordionMachine, accordionConnect } from '@timui/core'
```

**步骤 2：更新状态机使用**
```tsx
// 旧代码
const [state, send] = useMachine(accordionMachine, {
  context: {
    multiple: type === 'multiple',
    collapsible,
    // ...
  },
})

// 新代码
const [state, send] = useMachine(accordionMachine({
  id: id || 'accordion',
  multiple: type === 'multiple',
  collapsible,
  value: propValue ?? defaultValue,
  onValueChange(details) {
    onValueChange?.(details.value)
  },
}))
```

**步骤 3：使用 connect 函数生成 API**
```tsx
// 旧代码
const current = state.context.value
const isOpen = isMultiple
  ? Array.isArray(current) ? current.includes(item.value) : false
  : current === item.value

// 新代码
const api = accordionConnect(state, send, normalizeProps)
const isOpen = api.isItemOpen({ value: item.value })
```

**步骤 4：使用 API 提供的 props**
```tsx
// 旧代码
<button
  onClick={() => send({ type: 'ITEM.TOGGLE', value: item.value })}
  aria-expanded={isOpen}
  {...props}
>

// 新代码
<button
  {...api.getItemTriggerProps({ value: item.value })}
  {...props}
>
```

---

### Phase 2: Svelte 组件迁移

#### 2.1 更新所有 Svelte 组件使用官方 Hook

**当前实现：**
```svelte
<!-- packages/svelte/src/components/accordion.svelte -->
<script>
  import { useMachine } from '$lib/use-machine'  // ❌ 自定义实现
</script>
```

**目标实现：**
```svelte
<!-- packages/svelte/src/components/accordion.svelte -->
<script>
  import { useMachine, normalizeProps } from '@zag-js/svelte'  // ✅ 官方 Hook
  import { accordionMachine, accordionConnect } from '@timui/core'
</script>
```

#### 2.2 迁移步骤

**步骤 1：更新导入**
```svelte
<!-- 旧代码 -->
<script>
  import { useMachine } from '$lib/use-machine'
  import { accordionMachine } from '@timui/core'
</script>

<!-- 新代码 -->
<script>
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { accordionMachine, accordionConnect } from '@timui/core'
</script>
```

**步骤 2：更新状态机使用**
```svelte
<!-- 旧代码 -->
<script>
  const [state, send] = useMachine(accordionMachine, {
    context: {
      multiple: type === 'multiple',
      // ...
    },
  })
</script>

<!-- 新代码 -->
<script>
  const [state, send] = useMachine(accordionMachine({
    id: 'accordion',
    multiple: type === 'multiple',
    value: $value,
    onValueChange(details) {
      value = details.value
    },
  }))
  
  $: api = accordionConnect($state, send, normalizeProps)
</script>
```

**步骤 3：使用 API 提供的 props**
```svelte
<!-- 旧代码 -->
<button
  on:click={() => send({ type: 'ITEM.TOGGLE', value: item.value })}
  aria-expanded={isOpen}
>

<!-- 新代码 -->
<button
  {...api.getItemTriggerProps({ value: item.value })}
>
```

---

### Phase 3: 清理自定义实现

#### 3.1 删除自定义 useMachine Hook

**需要删除的文件：**
- ❌ `packages/react/src/hooks/use-machine.ts`
- ❌ `packages/svelte/src/lib/use-machine.ts`
- ❌ `apps/docs/registry/default/hooks/use-machine.ts`（如果存在）

#### 3.2 更新依赖

确保所有包都正确依赖官方 Zag.js Hook：

**packages/react/package.json:**
```json
{
  "dependencies": {
    "@zag-js/react": "^1.32.0"
  },
  "peerDependencies": {
    "@zag-js/react": "^1.32.0"
  }
}
```

**packages/svelte/package.json:**
```json
{
  "dependencies": {
    "@zag-js/svelte": "^1.32.0"
  },
  "peerDependencies": {
    "@zag-js/svelte": "^1.32.0"
  }
}
```

---

### Phase 4: 更新文档

#### 4.1 更新架构文档

更新 `packages/core/ARCHITECTURE.md`，明确说明：
- ✅ 所有组件统一使用 `@zag-js/*` 官方包
- ✅ 所有框架统一使用官方 `useMachine` Hook
- ✅ 不再使用自定义实现

#### 4.2 更新问题跟踪文档

更新 `architecture-issues.md`：
- ✅ 标记"统一使用 Zag.js"为已完成
- ✅ 移除"三层架构"相关记录
- ✅ 更新状态为"✅ 已修复"

---

## 📝 实施检查清单

### React 组件迁移

- [ ] 更新 `accordion.tsx` 使用 `@zag-js/react`
- [ ] 更新 `collapsible.tsx` 使用 `@zag-js/react`
- [ ] 更新 `dialog.tsx` 使用 `@zag-js/react`
- [ ] 更新 `checkbox.tsx` 使用 `@zag-js/react`
- [ ] 更新 `switch.tsx` 使用 `@zag-js/react`
- [ ] 更新 `select.tsx` 使用 `@zag-js/react`
- [ ] 更新 `tabs.tsx` 使用 `@zag-js/react`
- [ ] 更新 `popover.tsx` 使用 `@zag-js/react`
- [ ] 更新 `tooltip.tsx` 使用 `@zag-js/react`
- [ ] 更新 `menu.tsx` 使用 `@zag-js/react`
- [ ] 更新 `combobox.tsx` 使用 `@zag-js/react`
- [ ] 更新所有其他使用状态机的组件

### Svelte 组件迁移

- [ ] 更新 `accordion.svelte` 使用 `@zag-js/svelte`
- [ ] 更新 `collapsible.svelte` 使用 `@zag-js/svelte`
- [ ] 更新所有其他使用状态机的组件

### 清理工作

- [ ] 删除 `packages/react/src/hooks/use-machine.ts`
- [ ] 删除 `packages/svelte/src/lib/use-machine.ts`
- [ ] 删除 `apps/docs/registry/default/hooks/use-machine.ts`（如果存在）
- [ ] 更新所有导入路径

### 文档更新

- [ ] 更新 `packages/core/ARCHITECTURE.md`
- [ ] 更新 `architecture-issues.md`
- [ ] 更新 `skill.md`
- [ ] 创建迁移指南文档

### 测试验证

- [ ] 所有 React 组件功能正常
- [ ] 所有 Svelte 组件功能正常
- [ ] 所有 Vue 组件功能正常（已正确）
- [ ] 类型检查通过
- [ ] 单元测试通过
- [ ] 集成测试通过

---

## 🚀 实施优先级

1. **高优先级**：React 组件迁移（影响最大）
2. **高优先级**：Svelte 组件迁移
3. **中优先级**：清理自定义实现
4. **低优先级**：文档更新

---

## 📚 参考资源

- [Zag.js React 文档](https://zagjs.com/react)
- [Zag.js Svelte 文档](https://zagjs.com/svelte)
- [Zag.js Vue 文档](https://zagjs.com/vue)
- [Zag.js GitHub](https://github.com/chakra-ui/zag)

---

**文档版本：** v1.0  
**创建日期：** 2024-12-19  
**维护者：** Timkit UI Team