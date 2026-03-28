<script setup lang="ts">
import { ref } from 'vue';
import { MoonIcon, SunIcon } from 'lucide-vue-next';
import { Toggle } from '@timui/vue';



const theme = ref<string>('light');


function setTheme(next: typeof theme.value | ((prev: typeof theme.value) => typeof theme.value)) {
  theme.value = typeof next === 'function'
    ? (next as (prev: typeof theme.value) => typeof theme.value)(theme.value)
    : next;
}

</script>

<template>
  <div><Toggle variant="outline" class="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent" :pressed="theme === 'dark'" :onPressedChange="() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))" :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"><MoonIcon :size="16" class="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100" aria-hidden="true" /><SunIcon :size="16" class="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0" aria-hidden="true" /></Toggle></div>
</template>
