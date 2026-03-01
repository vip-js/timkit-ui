<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
<template>
// To make the notification fixed, add classes like "fixed bottom-4 right-4" to the container element.
    <div class="bg-background z-50 max-w-[400px] rounded-md border px-4 py-3 shadow-lg">
      <div class="flex gap-2">
        <p class="grow text-sm">
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-3 -mt-0.5 inline-flex text-blue-500"><circle cx="12" cy="12" r="9" /></svg>
          Just a quick note!
        </p>
        <Button
          variant="ghost"
          class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          aria-label="Close notification"
        >
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 transition-opacity group-hover:opacity-100"><circle cx="12" cy="12" r="9" /></svg>
        </Button>
      </div>
    </div>
</template>
