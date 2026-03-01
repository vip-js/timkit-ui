<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
  <div v-bind="attrs" data-slot="dropdown-menu-radio-group">
    <slot />
  </div>
</template>
