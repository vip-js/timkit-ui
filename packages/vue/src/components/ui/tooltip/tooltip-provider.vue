<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue'
import { usePassedProp } from '../../../hooks/passed-prop'
import { TooltipGroupKey } from './tooltip-group'

const props = defineProps<{
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
}>()
const attrs = useAttrs()
const passed = usePassedProp()
const lastOpened = ref(0)

provide(TooltipGroupKey, {
  delayDuration: computed(() => props.delayDuration),
  skipDelayDuration: computed(() => props.skipDelayDuration ?? 300),
  disableHoverableContent: computed(() => passed<boolean>(props, 'disableHoverableContent')),
  lastOpened,
  markOpened() {
    lastOpened.value = Date.now()
  },
})
</script>

<template>
  <div v-bind="attrs" data-slot="tooltip-provider">
    <slot />
  </div>
</template>
