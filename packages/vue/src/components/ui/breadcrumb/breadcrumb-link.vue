<script setup lang="ts">
import { computed, inject, onUnmounted, useAttrs, type ComputedRef } from 'vue'
import { Primitive, type PrimitiveProps } from '../../primitive'
import { breadcrumbLinkVariants, cn } from '@timui/core'
import type { HTMLAttributes } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<PrimitiveProps & { class?: HTMLAttributes['class']; disabled?: boolean; href?: string }>(),
  {
    as: 'a',
  }
)
const attrs = useAttrs()
const groupDisabled = inject<ComputedRef<boolean>>('breadcrumb-disabled', computed(() => false))
const unregister = inject<((current: boolean) => () => void) | null>('breadcrumb-register', null)?.(false)
onUnmounted(() => unregister?.())
const locked = computed(() => props.disabled === true || groupDisabled.value)
const rest = computed(() => {
  const { onClick: _onClick, ...rest } = attrs
  return rest
})

const choose = (event: MouseEvent) => {
  if (locked.value) {
    event.preventDefault()
    return
  }
  const listener = attrs.onClick as ((event: MouseEvent) => void) | undefined
  listener?.(event)
}
</script>

<template>
  <Primitive
    v-bind="rest"
    :as="as"
    :as-child="asChild"
    data-slot="breadcrumb-link"
    :href="locked ? undefined : props.href"
    :aria-disabled="locked || undefined"
    :tabindex="locked ? -1 : undefined"
    :class="cn(breadcrumbLinkVariants(), props.class)"
    @click="choose"
  >
    <slot />
  </Primitive>
</template>
