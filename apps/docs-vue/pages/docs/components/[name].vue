<template>
  <div class="component-page docs-container page-block">
    <div class="component-hero">
      <div class="hero-chip">Component</div>
      <h1 class="hero-title">{{ componentName }}</h1>
      <p class="hero-subtitle">Usage, variants, and composable patterns.</p>
    </div>

    <div class="component-grid">
      <section class="section wide">
        <div class="section-header">
          <h2 class="section-title">Example</h2>
          <p class="section-subtitle">Interact with the live preview.</p>
        </div>
        <ComponentPreview v-if="hasExample" :code="exampleCode">
          <VueComponentLoader :component-name="`${route.params.name}-01`" />
        </ComponentPreview>
        <div v-else class="code-surface">
          <div class="text-muted-foreground text-sm">
            Example preview not available yet.
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Install</h2>
          <p class="section-subtitle">Get the package into your project.</p>
        </div>
        <CodeBlock :code="installCode" language="bash" />
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Usage</h2>
          <p class="section-subtitle">Minimal example to get started.</p>
        </div>
        <CodeBlock :code="usageCode" language="vue" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import VueComponentLoader from '@/components/VueComponentLoader.vue'
import { vueComponentManifest } from '@/registry/vue-registry-manifest'

const route = useRoute()
const toPascalCase = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const componentName = computed(() => {
  const name = route.params.name as string
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
})

const hasExample = computed(() => {
  const name = route.params.name as string
  return Boolean(vueComponentManifest[`${name}-01`])
})

// 根据组件名称动态生成示例代码
const exampleCode = computed(() => {
  const name = route.params.name as string
  const PascalName = toPascalCase(name)
  return `<template>
  <${PascalName}>Button</${PascalName}>
</template>

<script setup lang="ts">
import { ${PascalName} } from '@timui/vue'
<\/script>`
})

const installCode = ref(`pnpm add @timui/vue`)

const usageCode = computed(() => {
  const name = route.params.name as string
  const CapitalizedName = toPascalCase(name)
  return `<template>
  <${CapitalizedName} variant="primary">
    Click me
  </${CapitalizedName}>
</template>

<script setup lang="ts">
import { ${CapitalizedName} } from '@timui/vue'
<\/script>`
})
</script>
