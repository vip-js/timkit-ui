<script setup lang="ts">
import { ref } from 'vue';
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';



const value = ref([3]);


function setValue(next: typeof value.value | ((prev: typeof value.value) => typeof value.value)) {
  value.value = typeof next === 'function'
    ? (next as (prev: typeof value.value) => typeof value.value)(value.value)
    : next;
}

</script>

<template>
  <div class="space-y-3"><div class="flex items-center justify-between gap-2"><Label class="leading-6">Rate your experience</Label><span class="text-sm font-medium">{{ labels[value[0] - 1] }}</span></div><div class="flex items-center gap-2"><span class="text-2xl">😡</span><Slider :value="value" @update:modelValue="setValue" :min="1" :max="5" aria-label="Rate your experience" /><span class="text-2xl">😍</span></div></div>
</template>
