<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, notificationVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div
    data-slot="notification"
    :class="cn(notificationVariants(), props.class)"
  >
    <slot />
  </div>
</template>
