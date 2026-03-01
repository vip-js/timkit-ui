<template>
  <div class="preview-container">
    <component :is="currentComponent" v-if="currentComponent" v-bind="componentProps" />
    <div v-else class="loading">
      <p>{{ loadMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, type Component } from 'vue'
declare const __TIMUI_DOCS_DEMO_ROOT__: string
declare const __TIMUI_BROKEN_DEMOS__: string[]

const currentComponent = shallowRef<Component | null>(null)
const componentProps = ref<Record<string, any>>({})
const loadMessage = ref('Waiting for component...')
const brokenDemoSet = new Set((__TIMUI_BROKEN_DEMOS__ || []).map((item) => item.toLowerCase()))

type ComponentModule = { default: Component }
type ComponentLoader = () => Promise<ComponentModule>

const componentMap: Record<string, ComponentLoader> = {}
const uiModules = import.meta.glob<ComponentModule>('../../../packages/vue/src/components/ui/**/*.vue')

for (const [modulePath, loader] of Object.entries(uiModules)) {
  const segments = modulePath.split('/')
  const fileName = segments[segments.length - 1] || ''
  const folderName = segments[segments.length - 2] || ''
  const baseName = fileName.replace('.vue', '').toLowerCase()
  const folderKey = folderName.toLowerCase()
  const typedLoader = loader as ComponentLoader

  if (!(baseName in componentMap)) {
    componentMap[baseName] = typedLoader
  }

  // Prefer folder-name component as primary entry (e.g. button/button.vue -> button)
  if (baseName === folderKey) {
    componentMap[folderKey] = typedLoader
  }
}

function resolveLoader(name: string): ComponentLoader | undefined {
  const normalizedName = name.toLowerCase()
  const parts = normalizedName.split('-').filter(Boolean)
  const candidates = new Set<string>([
    normalizedName,
    normalizedName.replace(/-\d+$/g, ''),
  ])

  for (let i = parts.length; i >= 1; i -= 1) {
    candidates.add(parts.slice(0, i).join('-'))
    candidates.add(parts.slice(parts.length - i).join('-'))
  }

  const directMatch = Array.from(candidates).map((key) => componentMap[key]).find(Boolean)

  const fuzzyKey = Object.keys(componentMap)
    .sort((a, b) => b.length - a.length)
    .find((key) => normalizedName.includes(key))
  if (directMatch) return directMatch
  if (fuzzyKey) return componentMap[fuzzyKey]

  return componentMap.button || componentMap[Object.keys(componentMap)[0] || '']
}

async function tryLoadDemoComponent(name: string): Promise<ComponentModule | null> {
  const normalizedName = name.toLowerCase()
  const parts = normalizedName.split('-').filter(Boolean)
  const candidates = new Set<string>([
    normalizedName,
    normalizedName.replace(/-\d+$/g, ''),
  ])

  for (let i = parts.length; i >= 1; i -= 1) {
    candidates.add(parts.slice(0, i).join('-'))
    candidates.add(parts.slice(parts.length - i).join('-'))
  }

  for (const candidate of candidates) {
    if (brokenDemoSet.has(candidate)) {
      continue
    }
    const group = candidate.replace(/-\d+$/g, '')
    const demoUrl = `/@fs/${__TIMUI_DOCS_DEMO_ROOT__}/${group}/${candidate}.vue`
    try {
      // @ts-ignore vite-ignore keeps runtime path untouched.
      // eslint-disable-next-line no-await-in-loop
      return (await import(/* @vite-ignore */ demoUrl)) as ComponentModule
    } catch {
      // continue
    }
  }

  return null
}

async function loadComponent(name: string): Promise<boolean> {
  try {
    const demoModule = await tryLoadDemoComponent(name)
    if (demoModule?.default) {
      currentComponent.value = demoModule.default
      loadMessage.value = ''
      window.parent.postMessage({ type: 'COMPONENT_LOADED', componentName: name }, '*')
      return true
    }

    const loader = resolveLoader(name)
    if (!loader) {
      throw new Error(`No available component loader for ${name}`)
    }

    const module = await loader()
    currentComponent.value = module.default
    loadMessage.value = ''
    window.parent.postMessage({ type: 'COMPONENT_LOADED', componentName: name }, '*')
    return true
  } catch (error) {
    console.error('Failed to load component:', error)
    loadMessage.value = `Failed to load component: ${name}`
    window.parent.postMessage({ type: 'COMPONENT_LOAD_FAILED', componentName: name }, '*')
    return false
  }
}

async function loadWithFallback(name: string) {
  const targetName = typeof name === 'string' && name ? name : 'button'
  const ok = await loadComponent(targetName)
  if (ok) return

  if (targetName !== 'button') {
    const fallbackOk = await loadComponent('button')
    if (fallbackOk) {
      loadMessage.value = `Fallback loaded: button (requested ${targetName})`
    }
  }
}

// 监听来自父窗口的消息
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const initialComponent = params.get('component') || 'button'
  loadWithFallback(initialComponent)

  window.addEventListener('message', (event) => {
    // 验证来源（生产环境应该检查 origin）
    const { type, componentName, props } = event.data
    
    if (type === 'LOAD_COMPONENT') {
      componentProps.value = props || {}
      loadWithFallback(componentName)
    }
    
    if (type === 'UPDATE_PROPS') {
      componentProps.value = props || {}
    }
  })
  
  // 通知父窗口已准备好
  window.parent.postMessage({ type: 'PREVIEW_READY' }, '*')
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}

.preview-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading {
  color: #666;
  text-align: center;
}
</style>
