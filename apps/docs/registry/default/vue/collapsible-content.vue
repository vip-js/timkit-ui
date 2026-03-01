<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const context = inject('collapsible') as { api: any } | null
const isOpen = computed(() => context?.api.open ?? false)
const contentProps = computed(() => context?.api.getContentProps?.() ?? {})
</script>

<template>
  <div
    v-bind="contentProps"
    data-slot="collapsible-content"
    :data-state="isOpen ? 'open' : 'closed'"
    :class="cn('overflow-hidden', props.class)"
  >
    <slot v-if="isOpen" />
  </div>
</template>
