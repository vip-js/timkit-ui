<template>
  <div v-if="loading" class="text-muted-foreground">Loading component...</div>
  <component v-else-if="componentInstance" :is="componentInstance" />
  <div v-else class="text-destructive">
    {{ errorMessage }}
    <div v-if="availableComponents.length" class="text-muted-foreground mt-2 text-xs">
      Available: {{ availableComponents.join(', ') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { vueComponentManifest } from '@/registry/vue-registry-manifest'

interface Props {
  componentName: string
}

const props = defineProps<Props>()

const componentInstance = ref<any>(null)
const loading = ref(true)
const error = ref<Error | null>(null)
const availableComponents = computed(() => Object.keys(vueComponentManifest))
const errorMessage = computed(() =>
  error.value ? error.value.message : `No preview available for ${props.componentName}`
)

let loadId = 0
const loadComponent = async (name: string) => {
  const currentId = ++loadId
  loading.value = true
  componentInstance.value = null
  error.value = null

  try {
    const loader = vueComponentManifest[name]
    if (!loader) {
      throw new Error(`No preview available for "${name}"`)
    }
    const module = await loader()
    if (currentId !== loadId) return
    componentInstance.value = module.default
  } catch (e) {
    if (currentId !== loadId) return
    error.value = e as Error
    if ((e as Error).message?.includes('No preview available') === false) {
      console.error('Failed to load component:', e)
    }
  } finally {
    if (currentId === loadId) {
      loading.value = false
    }
  }
}

watch(
  () => props.componentName,
  (name) => {
    if (!name) return
    void loadComponent(name)
  },
  { immediate: true }
)
</script>
