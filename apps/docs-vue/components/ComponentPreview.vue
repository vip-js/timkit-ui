<template>
  <div class="component-preview-wrapper">
    <div class="preview-header">
      <div class="preview-title">Component Preview</div>
      <div class="tab-group">
        <button
          @click="activeTab = 'preview'"
          :class="['tab-button', activeTab === 'preview' ? 'active' : '']"
        >
          Preview
        </button>
        <button
          @click="activeTab = 'code'"
          :class="['tab-button', activeTab === 'code' ? 'active' : '']"
        >
          Code
        </button>
      </div>
    </div>

    <div class="preview-frame">
      <div v-if="activeTab === 'preview'" class="preview-surface">
        <div class="preview-grid" aria-hidden="true"></div>
        <div class="preview-content">
          <slot />
        </div>
      </div>

      <div v-else class="code-surface">
        <pre class="text-sm overflow-x-auto"><code>{{ code }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  code?: string
}

const props = withDefaults(defineProps<Props>(), {
  code: ''
})

const activeTab = ref<'preview' | 'code'>('preview')
</script>
