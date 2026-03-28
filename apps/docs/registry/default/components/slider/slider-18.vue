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
  <div class="*:not-first:mt-3"><Label>Rate your experience</Label><div class="flex items-center gap-2"><Slider :value="value" @update:modelValue="setValue" :min="1" :max="5" showTooltip :tooltipContent="(value) => labels[value - 1]" aria-label="Rate your experience" /><span class="text-2xl">{{ emojis[value[0] - 1] }}</span></div></div>
</template>
