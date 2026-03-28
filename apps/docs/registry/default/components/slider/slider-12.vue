<script setup lang="ts">
import { ref } from 'vue';
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';



const value = ref([25, 75]);


function setValue(next: typeof value.value | ((prev: typeof value.value) => typeof value.value)) {
  value.value = typeof next === 'function'
    ? (next as (prev: typeof value.value) => typeof value.value)(value.value)
    : next;
}

</script>

<template>
  <div class="space-y-4"><div class="flex items-center justify-between gap-2"><Label class="leading-6">Dual range slider with output</Label><output class="text-sm font-medium tabular-nums">{{ value[0] }}- {{ value[1] }}</output></div><Slider :value="value" @update:modelValue="setValue" aria-label="Dual range slider with output" /></div>
</template>
