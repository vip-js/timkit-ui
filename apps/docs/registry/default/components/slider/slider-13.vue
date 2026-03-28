<script setup lang="ts">
import { ref } from 'vue';
import { Volume2Icon, VolumeXIcon } from 'lucide-vue-next';
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';



const value = ref([25]);


function setValue(next: typeof value.value | ((prev: typeof value.value) => typeof value.value)) {
  value.value = typeof next === 'function'
    ? (next as (prev: typeof value.value) => typeof value.value)(value.value)
    : next;
}

</script>

<template>
  <div class="space-y-3"><div class="flex items-center justify-between gap-2"><Label class="leading-6">Volume</Label><output class="text-sm font-medium tabular-nums">{{ value[0] }}</output></div><div class="flex items-center gap-2"><VolumeXIcon class="shrink-0 opacity-60" :size="16" aria-hidden="true" /><Slider :value="value" @update:modelValue="setValue" aria-label="Volume slider" /><Volume2Icon class="shrink-0 opacity-60" :size="16" aria-hidden="true" /></div></div>
</template>
