<script setup lang="ts">
import { cn, navigationMenuContentVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

import { useNavigationMenuItemContext } from './use-navigation-menu-context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const item = useNavigationMenuItemContext()
</script>

<template>
  <div
    v-if="item?.open.value"
    :id="item?.contentId.value"
    :aria-labelledby="item?.triggerId.value"
    data-slot="navigation-menu-content"
    data-state="open"
    :class="
      cn(
        navigationMenuContentVariants(),
        'absolute left-0 top-full mt-1 md:left-0 md:top-full',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
