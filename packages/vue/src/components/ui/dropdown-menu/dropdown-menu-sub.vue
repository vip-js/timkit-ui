<script setup lang="ts">
import { watch } from 'vue'
import { useDropdownMenuContext } from './use-dropdown-menu-context'
import {
  createDropdownMenuSubContext,
  provideDropdownMenuSubContext,
} from './use-dropdown-menu-sub-context'
import { useAttrs } from 'vue'

const attrs = useAttrs()
const api = useDropdownMenuContext()
const subContext = createDropdownMenuSubContext()

provideDropdownMenuSubContext(subContext)

watch(
  () => api.value.open,
  (isOpen) => {
    if (!isOpen) {
      subContext.setOpen(false)
    }
  }
)
</script>

<template>
  <div v-bind="attrs" data-slot="dropdown-menu-sub" :data-state="subContext.open.value ? 'open' : 'closed'">
    <slot />
  </div>
</template>
