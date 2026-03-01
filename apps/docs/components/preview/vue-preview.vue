<template>
  <div class="vue-preview-container">
    <div v-if="loading" class="preview-loading">
      <div class="spinner"></div>
      <p>Loading component...</p>
    </div>
    <div v-else-if="error" class="preview-error">
      <p>{{ error }}</p>
    </div>
    <component v-else :is="componentInstance" v-bind="componentProps" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'

interface Props {
  componentName: string
  componentProps?: Record<string, object>
}

const props = withDefaults(defineProps<Props>(), {
  componentProps: () => ({})
})

const loading = ref(true)
const error = ref('')
const componentInstance = ref<object>(null)

onMounted(async () => {
  try {
    // 动态导入组件
    const modules = import.meta.glob('@timui/vue/components/**/*.vue')
    const componentPath = Object.keys(modules).find(path => 
      path.includes(`/${props.componentName}.vue`)
    )
    
    if (!componentPath) {
      throw new Error(`Component ${props.componentName} not found`)
    }
    
    const module = await modules[componentPath]()
    componentInstance.value = module.default
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load component'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.vue-preview-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-loading,
.preview-error {
  text-align: center;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
