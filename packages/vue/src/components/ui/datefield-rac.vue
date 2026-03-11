<script setup lang="ts">
import DateFieldRac from './datefield/datefield-rac.vue'
</script>

<template>
  <DateFieldRac v-bind="$attrs">
    <slot />
  </DateFieldRac>
</template>
