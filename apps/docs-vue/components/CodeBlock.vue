<template>
  <div class="code-surface">
    <pre class="text-sm overflow-x-auto"><code :class="`language-${language}`">{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
interface Props {
  code: string
  language?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'typescript'
})
</script>
