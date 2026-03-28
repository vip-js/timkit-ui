<script setup lang="ts">
import { TriangleAlert, XIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';




</script>

<template>
  <div class="bg-background z-50 max-w-[400px] rounded-md border px-4 py-3 shadow-lg"><div class="flex gap-2"><p class="grow text-sm"><TriangleAlert class="me-3 -mt-0.5 inline-flex text-amber-500" :size="16" aria-hidden="true" />Some information is missing!
        </p><Button variant="ghost" class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent" aria-label="Close notification"><XIcon :size="16" class="opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" /></Button></div></div>
</template>
