<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaCorner, type ScrollAreaRootProps } from 'radix-vue'
import ScrollBar from '../scroll-bar/scroll-bar.vue'
import { cn, scrollAreaVariants, scrollAreaViewportVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<ScrollAreaRootProps & { class?: HTMLAttributes['class']; orientation?: 'horizontal' | 'vertical' | 'both' }>(),
  { orientation: 'vertical' }
)

const attrs = useAttrs()
const passthrough = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _by, ...rest } = attrs
  return rest
})
const labelledBy = computed(() => {
  const value = attrs['aria-labelledby']
  return typeof value === 'string' && value ? value : undefined
})
const scrollLabel = computed(() => {
  if (labelledBy.value) return undefined
  const label = attrs['aria-label']
  return typeof label === 'string' && label ? label : 'Scroll area'
})
const rootProps = computed(() => {
  const { orientation: _orientation, class: _class, ...rest } = props
  return { ...rest, ...passthrough.value }
})

const viewportStyle = computed<{ overflowX: 'auto' | 'hidden'; overflowY: 'auto' | 'hidden' }>(() =>
  props.orientation === 'horizontal'
    ? { overflowX: 'auto', overflowY: 'hidden' }
    : props.orientation === 'both'
      ? { overflowX: 'auto', overflowY: 'auto' }
      : { overflowX: 'hidden', overflowY: 'auto' }
)
</script>

<template>
  <ScrollAreaRoot
    v-bind="rootProps"
    data-slot="scroll-area"
    :data-orientation="props.orientation"
    :class="cn(scrollAreaVariants(), props.class)"
  >
    <p v-if="props.orientation === 'both'" role="status">Both</p>
    <p v-else-if="props.orientation === 'horizontal'" role="status">Horizontal</p>
    <p v-else role="status">Vertical</p>
    <ScrollAreaViewport :class="scrollAreaViewportVariants()">
      <div
        data-slot="scroll-viewport"
        :data-orientation="props.orientation"
        :style="viewportStyle"
        :aria-labelledby="labelledBy"
        :aria-label="scrollLabel"
      >
        <slot />
      </div>
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
