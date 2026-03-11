<template>
  <div
    class="preview-container min-h-screen w-full items-center justify-center p-8 text-foreground"
  >
    <div
      v-if="currentFramework === 'html'"
      ref="htmlContainer"
      class="html-preview min-h-[320px] w-full"
    ></div>
    <component :is="currentComponent" v-else-if="currentComponent" v-bind="componentProps" />
    <div v-else class="loading text-muted-foreground">
      <p>{{ loadMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DEFAULT_PREVIEW_ALLOWED_ORIGINS,
  isLoadPreviewMessage,
  isPreviewAllowedOrigin,
  isUpdatePropsMessage,
  parsePreviewAllowedOrigins,
  PREVIEW_PROTOCOL_VERSION,
  resolvePreviewParentOrigin,
  type PreviewData,
  type LoadPreviewMessage,
  type PreviewFramework,
  type UpdatePropsMessage,
} from '@timui/core/preview-protocol'
import { autoInitHtmlRuntime, htmlRuntimeCapabilities } from '@timui/html'
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type Component,
} from 'vue'

declare const __TIMUI_DOCS_DEMO_ROOT__: string

type PreviewProps = Record<string, PreviewData>
type LegacyLoadComponentMessage = {
  type: 'LOAD_COMPONENT'
  componentName?: string
  props?: PreviewProps
}
type LegacyUpdatePropsMessage = {
  type: 'UPDATE_PROPS'
  props?: PreviewProps
}

const currentComponent = shallowRef<Component | null>(null)
const componentProps = ref<PreviewProps>({})
const loadMessage = ref('Waiting for component...')
const currentFramework = ref<'vue' | 'html'>('vue')
const currentRequestId = ref(`init-${Date.now()}`)
const htmlCode = ref('')
const htmlContainer = ref<HTMLElement | null>(null)
const allowLegacyProtocol = import.meta.env.VITE_PREVIEW_ALLOW_LEGACY !== '0'
const legacyWarningShown = ref(false)
const allowedParentOrigins = parsePreviewAllowedOrigins(
  import.meta.env.VITE_PREVIEW_ALLOWED_ORIGINS
)
const parentOrigin = ref<string | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)
const resizeTimer = ref<number | null>(null)
const lastHeight = ref(0)

type PreviewRequest = {
  version?: string
  requestId?: string
  framework?: PreviewFramework
  componentName?: string
  componentPath?: string
  props?: PreviewProps
  code?: string
}

type ComponentModule = { default: Component }
type ComponentLoader = () => Promise<ComponentModule>

function getPreviewGroupName(name: string) {
  return name.replace(/-\d{1,3}$/g, '').replace(/-demo$/g, '')
}

function buildPreviewCandidates(name: string) {
  const normalizedName = name.toLowerCase()
  const group = getPreviewGroupName(normalizedName)

  return Array.from(
    new Set([
      normalizedName,
      `${group}-demo`,
      group,
    ].filter(Boolean))
  )
}

function resolveParentOrigin(): string | null {
  if (parentOrigin.value) return parentOrigin.value
  const ancestorOrigin = window.location.ancestorOrigins?.[0]
  if (ancestorOrigin && isPreviewAllowedOrigin(ancestorOrigin, allowedParentOrigins)) {
    return ancestorOrigin
  }
  const sameOrigin = window.location.origin
  if (sameOrigin && isPreviewAllowedOrigin(sameOrigin, allowedParentOrigins)) {
    return sameOrigin
  }
  return null
}

function postToParent(payload: Record<string, unknown>) {
  const targetOrigin = resolveParentOrigin() || '*'
  window.parent.postMessage(payload, targetOrigin)
}

function emitResize() {
  const height = Math.ceil(
    document.documentElement?.scrollHeight || document.body?.scrollHeight || 0
  )
  if (!height || height === lastHeight.value) return
  lastHeight.value = height
  postToParent({ type: 'PREVIEW_RESIZE', height })
}

function scheduleResize(delay = 50) {
  if (resizeTimer.value) window.clearTimeout(resizeTimer.value)
  resizeTimer.value = window.setTimeout(() => emitResize(), delay)
}

const componentMap: Record<string, ComponentLoader> = {}
const uiModules = import.meta.glob<ComponentModule>(
  '../../../packages/vue/src/components/ui/**/*.vue'
)

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
  const candidates = new Set<string>([normalizedName, normalizedName.replace(/-\d+$/g, '')])

  for (let i = parts.length; i >= 1; i -= 1) {
    candidates.add(parts.slice(0, i).join('-'))
    candidates.add(parts.slice(parts.length - i).join('-'))
  }

  const directMatch = Array.from(candidates)
    .map((key) => componentMap[key])
    .find(Boolean)

  const fuzzyKey = Object.keys(componentMap)
    .sort((a, b) => b.length - a.length)
    .find((key) => normalizedName.includes(key))
  if (directMatch) return directMatch
  if (fuzzyKey) return componentMap[fuzzyKey]

  return componentMap.button || componentMap[Object.keys(componentMap)[0] || '']
}

function inferHtmlRuntimeComponents(target: HTMLElement) {
  return htmlRuntimeCapabilities
    .filter((capability) => target.querySelector(capability.selector))
    .map((capability) => capability.name)
}

async function tryLoadDemoComponent(name: string): Promise<ComponentModule | null> {
  for (const candidate of buildPreviewCandidates(name)) {
    const group = getPreviewGroupName(candidate)
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

async function tryLoadHtmlDemo(name: string): Promise<string | null> {
  for (const candidate of buildPreviewCandidates(name)) {
    const group = getPreviewGroupName(candidate)
    const demoUrl = `/@fs/${__TIMUI_DOCS_DEMO_ROOT__}/${group}/${candidate}.html?raw`
    try {
      // @ts-ignore vite-ignore keeps runtime path untouched.
      // eslint-disable-next-line no-await-in-loop
      const mod = (await import(/* @vite-ignore */ demoUrl)) as { default?: string }
      if (typeof mod.default === 'string') return mod.default
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
      currentFramework.value = 'vue'
      currentComponent.value = demoModule.default
      loadMessage.value = ''
      postToParent({
        type: 'PREVIEW_RENDERED',
        version: PREVIEW_PROTOCOL_VERSION,
        requestId: currentRequestId.value,
        framework: 'vue',
        componentName: name,
      })
      scheduleResize()
      postToParent({ type: 'COMPONENT_LOADED', componentName: name })
      return true
    }

    const loader = resolveLoader(name)
    if (!loader) {
      throw new Error(`No available component loader for ${name}`)
    }

    const module = await loader()
    currentFramework.value = 'vue'
    currentComponent.value = module.default
    loadMessage.value = ''
    postToParent({
      type: 'PREVIEW_RENDERED',
      version: PREVIEW_PROTOCOL_VERSION,
      requestId: currentRequestId.value,
      framework: 'vue',
      componentName: name,
    })
    scheduleResize()
    postToParent({ type: 'COMPONENT_LOADED', componentName: name })
    return true
  } catch (error) {
    console.error('Failed to load component:', error)
    loadMessage.value = `Failed to load component: ${name}`
    postToParent({
      type: 'PREVIEW_FAILED',
      version: PREVIEW_PROTOCOL_VERSION,
      requestId: currentRequestId.value,
      framework: 'vue',
      componentName: name,
      message: String(error),
    })
    postToParent({ type: 'COMPONENT_LOAD_FAILED', componentName: name })
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

function renderHtmlDocument(code: string) {
  const target = htmlContainer.value
  if (!target) return

  const sanitized = code.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
  target.innerHTML = sanitized
  const components = inferHtmlRuntimeComponents(target)
  if (components.length > 0) {
    autoInitHtmlRuntime({ root: target, components, immediate: true })
  }

  scheduleResize()
}

async function loadHtml(code: string, componentName?: string): Promise<boolean> {
  try {
    currentFramework.value = 'html'
    currentComponent.value = null
    htmlCode.value = code || (componentName ? ((await tryLoadHtmlDemo(componentName)) ?? '') : '')
    if (!htmlCode.value) {
      throw new Error(`No HTML preview source for ${componentName || 'unknown component'}`)
    }
    await nextTick()
    renderHtmlDocument(htmlCode.value)
    loadMessage.value = ''
    postToParent({
      type: 'PREVIEW_RENDERED',
      version: PREVIEW_PROTOCOL_VERSION,
      requestId: currentRequestId.value,
      framework: 'html',
      componentName,
    })
    scheduleResize()
    return true
  } catch (error) {
    console.error('Failed to render html preview:', error)
    loadMessage.value = 'Failed to render html preview'
    postToParent({
      type: 'PREVIEW_FAILED',
      version: PREVIEW_PROTOCOL_VERSION,
      requestId: currentRequestId.value,
      framework: 'html',
      componentName,
      message: String(error),
    })
    return false
  }
}

async function handlePreviewRequest(payload: PreviewRequest) {
  if (payload.version && payload.version !== PREVIEW_PROTOCOL_VERSION) return
  currentRequestId.value = payload.requestId || `legacy-${Date.now()}`
  const framework = payload.framework || 'vue'

  if (framework === 'html') {
    await loadHtml(payload.code || '', payload.componentName)
    return
  }

  const componentName = payload.componentName || 'button'
  componentProps.value = payload.props || {}
  await loadWithFallback(componentName)
}

// 监听来自父窗口的消息
onMounted(() => {
  const referrerOrigin = resolvePreviewParentOrigin(document.referrer, allowedParentOrigins)
  const ancestorOrigin = window.location.ancestorOrigins?.[0]
  parentOrigin.value =
    referrerOrigin ||
    (ancestorOrigin && isPreviewAllowedOrigin(ancestorOrigin, allowedParentOrigins)
      ? ancestorOrigin
      : null)

  const params = new URLSearchParams(window.location.search)
  const initialFramework = params.get('framework')
  const initialComponent = params.get('component') || 'button'
  if (initialFramework === 'html') {
    currentFramework.value = 'html'
    loadMessage.value = 'Waiting for HTML payload...'
  } else {
    loadWithFallback(initialComponent)
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent) return
    if (!isPreviewAllowedOrigin(event.origin, allowedParentOrigins)) return
    if (!parentOrigin.value) {
      parentOrigin.value = event.origin
    } else if (event.origin !== parentOrigin.value) {
      return
    }

    const message = event.data as
      | LoadPreviewMessage
      | UpdatePropsMessage
      | LegacyLoadComponentMessage
      | LegacyUpdatePropsMessage
      | { type?: string }

    if (isLoadPreviewMessage(message)) {
      const payload = message
      handlePreviewRequest({
        version: payload.version,
        requestId: payload.requestId,
        framework: payload.framework,
        componentName: payload.componentName,
        props: payload.props as PreviewProps | undefined,
        code: payload.code,
      })
      return
    }

    if ((message as { type?: string }).type === 'LOAD_COMPONENT') {
      if (!allowLegacyProtocol) {
        postToParent({
          type: 'PREVIEW_FAILED',
          version: PREVIEW_PROTOCOL_VERSION,
          requestId: `legacy-denied-${Date.now()}`,
          framework: 'vue',
          message: 'Legacy protocol LOAD_COMPONENT is disabled. Use LOAD_PREVIEW instead.',
        })
        return
      }
      if (!legacyWarningShown.value) {
        console.warn(
          '[timui-preview] legacy protocol LOAD_COMPONENT is deprecated; please migrate to LOAD_PREVIEW.'
        )
        legacyWarningShown.value = true
      }
      const legacy = message as LegacyLoadComponentMessage
      componentProps.value = legacy.props || {}
      handlePreviewRequest({
        version: PREVIEW_PROTOCOL_VERSION,
        requestId: `legacy-${Date.now()}`,
        framework: 'vue',
        componentName: legacy.componentName,
        props: legacy.props,
      })
      return
    }

    if (isUpdatePropsMessage(message)) {
      componentProps.value = message.props || {}
      return
    }

    if ((message as { type?: string }).type === 'UPDATE_PROPS') {
      if (!allowLegacyProtocol) {
        return
      }
      if (!legacyWarningShown.value) {
        console.warn(
          '[timui-preview] legacy protocol UPDATE_PROPS is deprecated; please migrate to protocol versioned UPDATE_PROPS.'
        )
        legacyWarningShown.value = true
      }
      const legacy = message as LegacyUpdatePropsMessage
      componentProps.value = legacy.props || {}
    }
  })

  // 通知父窗口已准备好
  postToParent({
    type: 'PREVIEW_READY',
    version: PREVIEW_PROTOCOL_VERSION,
    framework: currentFramework.value,
  })

  if ('ResizeObserver' in window) {
    resizeObserver.value = new ResizeObserver(() => scheduleResize())
    resizeObserver.value.observe(document.body)
  } else {
    resizeTimer.value = window.setInterval(() => scheduleResize(0), 500)
  }

  scheduleResize()
})

watch([currentComponent, htmlCode, componentProps], async () => {
  await nextTick()
  scheduleResize()
})

onBeforeUnmount(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
  if (resizeTimer.value) {
    window.clearTimeout(resizeTimer.value)
  }
})
</script>

<style>
.loading {
  text-align: center;
}
</style>
