<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, notificationActionsVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div
    data-slot="notification-actions"
    :class="cn(notificationActionsVariants(), props.class)"
  >
    <slot />
  </div>
</template>
