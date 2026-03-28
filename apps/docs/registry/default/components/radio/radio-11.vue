<script setup lang="ts">
import { Brush, Eraser, Scissors, SwatchBook } from 'lucide-vue-next';
import { Label } from '@timui/vue';
import { RadioGroup } from '@timui/vue';
import { RadioGroupItem } from '@timui/vue';





const id = 'radio-11';


const items = [
    { value: '1', label: 'Palette', Icon: SwatchBook },
    { value: '2', label: 'Brush', Icon: Brush },
    { value: '3', label: 'Eraser', Icon: Eraser },
    { value: '4', label: 'Cut', Icon: Scissors },
  ]

</script>

<template>
  <RadioGroup class="grid-cols-2" default-value="1"><div v-for="(item, index) in items" :key="`${id}-${item.value}`" class="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"><div class="flex justify-between gap-2"><RadioGroupItem :id="`${id}-${item.value}`" :value="item.value" class="order-1 after:absolute after:inset-0" /><item.Icon class="opacity-60" :size="16" aria-hidden="true" /></div><Label :htmlFor="`${id}-${item.value}`">{{ item.label }}</Label></div></RadioGroup>
</template>
