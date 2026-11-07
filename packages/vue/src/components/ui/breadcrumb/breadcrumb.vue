<script setup lang="ts">
import { computed, provide, ref, useAttrs, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
  separator?: string
  disabled?: boolean
}>()

const attrs = useAttrs()
const navLabel = computed(() => {
  const label = attrs['aria-label']
  return typeof label === 'string' && label ? label : 'breadcrumb'
})
provide('breadcrumb-separator', computed(() => props.separator))
provide('breadcrumb-disabled', computed(() => props.disabled === true))
let nextId = 0
const crumbs = ref<Array<{ id: number; current: boolean }>>([])
const registerCrumb = (current: boolean) => {
  const id = ++nextId
  crumbs.value = [...crumbs.value, { id, current }]
  return () => {
    crumbs.value = crumbs.value.filter((item) => item.id !== id)
  }
}
provide('breadcrumb-register', registerCrumb)
const crumbStatus = computed(() => {
  const current = crumbs.value.findIndex((item) => item.current)
  return current < 0 ? '' : `Crumb ${current + 1} of ${crumbs.value.length}`
})
</script>

<template>
  <nav
    :aria-label="navLabel"
    data-slot="breadcrumb"
    :aria-disabled="props.disabled || undefined"
    :data-disabled="props.disabled ? '' : undefined"
    :class="cn(props.class)"
  >
    <p v-if="crumbStatus" role="status">{{ crumbStatus }}</p>
    <slot />
  </nav>
</template>
