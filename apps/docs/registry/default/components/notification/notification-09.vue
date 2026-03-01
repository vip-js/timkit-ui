<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
<template>
// To make the notification fixed, add classes like "fixed bottom-4 right-4" to the container element.
    <div class="bg-background z-50 max-w-[400px] rounded-md border px-4 py-3 shadow-lg">
      <div class="flex items-center gap-2">
        <div class="flex grow items-center gap-3">
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0 text-emerald-500"><circle cx="12" cy="12" r="9" /></svg>
          <div class="flex grow items-center justify-between gap-12">
            <p class="text-sm">You&lsquo;ve made changes!</p>
            <Button size="sm">Undo</Button>
          </div>
        </div>
        <Button
          variant="ghost"
          class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          aria-label="Close banner"
        >
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 transition-opacity group-hover:opacity-100"><circle cx="12" cy="12" r="9" /></svg>
        </Button>
      </div>
    </div>
</template>
