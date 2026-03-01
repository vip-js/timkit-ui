<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, notificationIconVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="notification-icon" :class="cn(notificationIconVariants(), props.class)">
    <slot />
  </div>
</template>
