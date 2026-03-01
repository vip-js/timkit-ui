<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, notificationTitleVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <p data-slot="notification-title" :class="cn(notificationTitleVariants(), props.class)">
    <slot />
  </p>
</template>
