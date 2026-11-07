<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { useCollapsibleContext } from './use-collapsible-context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const api = useCollapsibleContext()
const contentProps = computed(() => api.value.getContentProps())
const labelledBy = computed(
  () => contentProps.value['aria-labelledby'] || api.value.getTriggerProps().id
)
</script>

<template>
  <div
    v-bind="contentProps"
    data-slot="collapsible-content"
    role="region"
    :aria-labelledby="labelledBy"
    :class="cn('overflow-hidden', props.class)"
  >
    <slot v-if="api.visible" />
  </div>
</template>
