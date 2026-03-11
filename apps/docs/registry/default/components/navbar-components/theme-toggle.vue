<script setup lang="ts">
import { MoonIcon, SunIcon } from 'lucide-vue-next';
import { Toggle } from '@/components/ui/toggle';



</script>

<template>
  <div><Toggle variant="outline" class="group data-[state=on]:hover:bg-muted text-muted-foreground data-[state=on]:text-muted-foreground data-[state=on]:hover:text-foreground size-8 rounded-full border-none shadow-none data-[state=on]:bg-transparent" :pressed="theme === 'dark'" :onPressedChange="() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))" :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"><MoonIcon :size="16" class="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100" aria-hidden="true" /><SunIcon :size="16" class="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0" aria-hidden="true" /></Toggle></div>
</template>
