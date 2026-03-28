<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@timui/vue';
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';



const value = ref([min_price, max_price]);


function setValue(next: typeof value.value | ((prev: typeof value.value) => typeof value.value)) {
  value.value = typeof next === 'function'
    ? (next as (prev: typeof value.value) => typeof value.value)(value.value)
    : next;
}

</script>

<template>
  <div class="*:not-first:mt-3"><Label class="tabular-nums">From {{ formatPrice(value[0]) }}to {{ formatPrice(value[1]) }}</Label><div class="flex items-center gap-4"><Slider :value="value" @update:modelValue="setValue" :min="min_price" :max="max_price" aria-label="Price range slider" /><Button variant="outline">Go</Button></div></div>
</template>
