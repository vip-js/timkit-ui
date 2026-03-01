<script setup lang="ts">
import { Info } from '@/components/ui/info'
import { Button } from '@/components/ui/button'
</script>
<template>
// To make the notification fixed, add classes like "fixed bottom-4 right-4" to the container element.
    <div class="bg-background z-50 max-w-[400px] rounded-md border p-4 shadow-lg">
      <div class="flex gap-2">
        <div class="flex grow gap-3">
          <Info class="mt-0.5 shrink-0 text-blue-500" size="16" aria-hidden="true" />
          <div class="flex grow flex-col gap-3">
            <div class="space-y-1">
              <p class="text-sm font-medium">Here is some helpful information!</p>
              <p class="text-muted-foreground text-sm">
                It aims to provide clarity or support for better decision-making.
              </p>
            </div>
            <div class="flex gap-2">
              <Button size="sm">Learn more</Button>
            </div>
          </div>
          <Button
            variant="ghost"
            class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            aria-label="Close notification"
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 transition-opacity group-hover:opacity-100"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
        </div>
      </div>
    </div>
</template>
