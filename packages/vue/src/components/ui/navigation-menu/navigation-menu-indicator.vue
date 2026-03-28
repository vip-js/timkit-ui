<script setup lang="ts">
import { cn, navigationMenuIndicatorIconVariants, navigationMenuIndicatorVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

import { useNavigationMenuRootContext } from './use-navigation-menu-context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const root = useNavigationMenuRootContext()
</script>

<template>
  <div
    v-if="root?.openItem.value"
    data-slot="navigation-menu-indicator"
    data-state="visible"
    :class="
      cn(
        navigationMenuIndicatorVariants(),
        props.class
      )
    "
  >
    <div :class="navigationMenuIndicatorIconVariants()" />
  </div>
</template>
