# Button 跨框架示范（HTML / React / Vue / Svelte）

目标：以统一 schema（`packages/core/schemas/button.ts`）为源，提供四端一致的 props/variants/slots，复用同一套设计令牌与样式。

## 共享前置
- 设计令牌：`pnpm tokens:build` 在 `packages/tokens/dist/theme.css` 生成 CSS 变量（必引）；小程序需 `theme.wxss`。
- 基础样式：`packages/shared/button.css` 定义了 `.tk-button`、variants（primary/secondary/ghost/destructive）、size（sm/md/lg）、加载/禁用态。
- 依赖：无额外运行时依赖，React/Vue/Svelte 需对应框架与构建插件。

## HTML 版本
路径：`packages/html/button.html`
要点：直接 `<link>` 引入 `theme.css` 与 `button.css`，按类名组合即可。

## React 版本
路径：`packages/react/Button.tsx`
用法示例：
```tsx
import "@/packages/shared/button.css" // 或 @timkit/shared/button.css
import { Button } from "@/packages/react/Button"

<Button
  variant="primary"
  size="md"
  label="提交"
  leftIcon={<CheckIcon />}
  loading={false}
  onPress={() => console.log("pressed")}
/>
```

## Vue 版本
路径：`packages/vue/TkButton.vue`
用法示例：
```vue
<script setup lang="ts">
import "@/packages/shared/button.css"
import TkButton from "@/packages/vue/TkButton.vue"
</script>

<TkButton variant="secondary" size="lg" label="保存" @press="handlePress">
  <template #icon-left>💾</template>
</TkButton>
```

## Svelte 版本
路径：`packages/svelte/TkButton.svelte`
用法示例：
```svelte
<script lang="ts">
  import "@/packages/shared/button.css"
  import TkButton from "@/packages/svelte/TkButton.svelte"
  const onPress = (event) => console.log("press", event)
</script>

<TkButton variant="ghost" size="sm" label="了解更多" on:press={onPress} />
```

## 下一步
- 将生成逻辑脚本化：从 schema → 四端代码模板生成，确保 API 一致。
- 在文档站组件详情页加载四端代码片段/iframe，实现可视化对齐。
- 增加快照或交互测试验证 props/variants/states 在四端一致。
- 补充 props/事件/slots/variants 对齐表，方便使用者比对多框架 API。
