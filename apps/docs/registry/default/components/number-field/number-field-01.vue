<script setup lang="ts">
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@timui/vue'
</script>

<template>
  <NumberField :default-value="20" :min="0" :max="100" :spin-on-press="false" aria-label="Quantity">
    <NumberFieldDecrement aria-label="Decrease quantity">−</NumberFieldDecrement>
    <NumberFieldInput />
    <NumberFieldIncrement aria-label="Increase quantity">+</NumberFieldIncrement>
  </NumberField>
</template>
