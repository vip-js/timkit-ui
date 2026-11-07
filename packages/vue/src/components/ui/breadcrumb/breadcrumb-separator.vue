<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from 'vue'
import { breadcrumbSeparatorVariants, cn } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const separator = inject('breadcrumb-separator', computed(() => undefined as string | undefined))
</script>

<template>
  <li
    data-slot="breadcrumb-separator"
    role="presentation"
    aria-hidden="true"
    :class="cn(breadcrumbSeparatorVariants(), props.class)"
  >
    <slot>
      <span>{{ separator ?? '/' }}</span>
    </slot>
  </li>
</template>
