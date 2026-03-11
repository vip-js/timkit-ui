<script setup lang="ts">
import { TimeField } from '../datefield/datefield-rac.vue'
</script>

<template>
  <TimeField v-bind="$attrs">
    <slot />
  </TimeField>
</template>
