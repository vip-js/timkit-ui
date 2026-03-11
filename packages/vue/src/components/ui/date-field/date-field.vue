<script setup lang="ts">
import { DateField } from '../datefield/datefield-rac.vue'
</script>

<template>
  <DateField v-bind="$attrs">
    <slot />
  </DateField>
</template>
