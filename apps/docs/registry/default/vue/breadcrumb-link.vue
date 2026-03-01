<script setup lang="ts">
import { Primitive, type PrimitiveProps } from './primitive'
import { breadcrumbLinkVariants, cn } from '@timui/core'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'a',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="breadcrumb-link"
    :class="cn(breadcrumbLinkVariants(), props.class)"
  >
    <slot />
  </Primitive>
</template>
