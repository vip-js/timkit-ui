<script setup lang="ts">
import { CircleCheckIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';




</script>

<template>
  <div class="bg-background z-50 max-w-[400px] rounded-md border px-4 py-3 shadow-lg"><div class="flex items-center gap-2"><div class="flex grow items-center gap-3"><CircleCheckIcon class="mt-0.5 shrink-0 text-emerald-500" :size="16" aria-hidden="true" /><div class="flex grow items-center justify-between gap-12"><p class="text-sm">You&lsquo;ve made changes!</p><Button size="sm">Undo</Button></div></div><Button variant="ghost" class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent" aria-label="Close banner"><XIcon :size="16" class="opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" /></Button></div></div>
</template>
