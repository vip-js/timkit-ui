<script setup lang="ts">
import { cn, navigationMenuLinkVariants } from '@timui/core'
import { computed, onMounted, useId, type HTMLAttributes } from 'vue'

import { useNavigationMenuRootContext } from './use-navigation-menu-context'

const props = defineProps<{ class?: HTMLAttributes['class']; active?: boolean }>()
const root = useNavigationMenuRootContext()
const linkId = useId()

const isActive = computed(() => {
  if (!root) return !!props.active
  return root.userSelected.value ? root.activeItem.value === linkId : !!props.active
})

const onClick = () => {
  root?.setOpenItem(null)
  root?.setActiveItem(linkId)
  root?.setUserSelected(true)
}

onMounted(() => {
  if (!root) return
  if (root.userSelected.value) return
  if (!props.active) return
  if (root.activeItem.value) return
  root.setActiveItem(linkId)
})
</script>

<template>
  <a
    data-slot="navigation-menu-link"
    :data-active="isActive ? '' : undefined"
    :aria-current="isActive ? 'page' : undefined"
    :class="
      cn(
        navigationMenuLinkVariants(),
        props.class
      )
    "
    @click="onClick"
  >
    <slot />
  </a>
</template>
