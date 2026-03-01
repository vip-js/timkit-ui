<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, notificationDescriptionVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <p
    data-slot="notification-description"
    :class="cn(notificationDescriptionVariants(), props.class)"
  >
    <slot />
  </p>
</template>
