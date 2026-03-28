<script setup lang="ts">
import { Brush, Eraser, Scissors, SwatchBook } from 'lucide-vue-next';
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-17';


const items = [
    { value: '1', label: 'Palette', Icon: SwatchBook, defaultChecked: true },
    { value: '2', label: 'Brush', Icon: Brush },
    { value: '3', label: 'Eraser', Icon: Eraser },
    { value: '4', label: 'Cut', Icon: Scissors },
  ]

</script>

<template>
  <div class="grid grid-cols-2 gap-3"><div v-for="(item, index) in items" :key="`${id}-${item.value}`" class="border-input has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"><div class="flex justify-between gap-2"><Checkbox :id="`${id}-${item.value}`" :value="item.value" class="order-1 after:absolute after:inset-0" :defaultChecked="item.defaultChecked" /><item.Icon class="opacity-60" :size="16" aria-hidden="true" /></div><Label :htmlFor="`${id}-${item.value}`">{{ item.label }}</Label></div></div>
</template>
