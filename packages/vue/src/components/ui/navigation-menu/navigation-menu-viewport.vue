<script setup lang="ts">
import { cn, navigationMenuViewportVariants, navigationMenuViewportWrapperVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

import { useNavigationMenuRootContext } from './use-navigation-menu-context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const root = useNavigationMenuRootContext()
</script>

<template>
  <div v-if="root?.viewport.value" :class="navigationMenuViewportWrapperVariants()">
    <div
      data-slot="navigation-menu-viewport"
      :data-state="root?.openItem.value ? 'open' : 'closed'"
      :class="
        cn(
          navigationMenuViewportVariants(),
          props.class
        )
      "
    />
  </div>
</template>
