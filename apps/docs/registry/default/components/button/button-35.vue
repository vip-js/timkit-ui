<script setup lang="ts">
import { ref } from 'vue'
import { ToggleGroup } from '@timui/vue'
import { ToggleGroupItem } from '@timui/vue'

const value = ref<string>('left')

const handleValueChange = (next?: string) => {
  if (next) value.value = next
}
</script>

<template>
  <ToggleGroup
    type="single"
    variant="outline"
    :value="value"
    @update:modelValue="handleValueChange"
  >
    <ToggleGroupItem class="flex-1" value="left">Left</ToggleGroupItem>
    <ToggleGroupItem class="flex-1" value="center">Center</ToggleGroupItem>
    <ToggleGroupItem class="flex-1" value="right">Right</ToggleGroupItem>
  </ToggleGroup>
</template>
