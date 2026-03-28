<script setup lang="ts">
import { ref } from 'vue'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from 'lucide-vue-next'
import { ToggleGroup } from '@timui/vue'
import { ToggleGroupItem } from '@timui/vue'

const value = ref<string>('center')

const handleValueChange = (next?: string) => {
  if (next) value.value = next
}
</script>

<template>
  <ToggleGroup
    class="divide-background inline-flex divide-x"
    type="single"
    :value="value"
    @update:modelValue="handleValueChange"
  >
    <ToggleGroupItem
      class="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      aria-label="Align Left"
      value="left"
    >
      <AlignLeftIcon :size="16" aria-hidden="true" />
    </ToggleGroupItem>
    <ToggleGroupItem
      class="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      aria-label="Align Center"
      value="center"
    >
      <AlignCenterIcon :size="16" aria-hidden="true" />
    </ToggleGroupItem>
    <ToggleGroupItem
      class="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      aria-label="Align Right"
      value="right"
    >
      <AlignRightIcon :size="16" aria-hidden="true" />
    </ToggleGroupItem>
    <ToggleGroupItem
      class="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      aria-label="Align Justify"
      value="justify"
    >
      <AlignJustifyIcon :size="16" aria-hidden="true" />
    </ToggleGroupItem>
  </ToggleGroup>
</template>
