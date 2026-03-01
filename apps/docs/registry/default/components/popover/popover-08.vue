<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
</script>
<template>
<div class="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Feedback</Button>
        </PopoverTrigger>
        <PopoverContent class="w-72">
          <h2 class="mb-2 text-sm font-semibold">Send us feedback</h2>
          <form class="space-y-3">
            <Textarea
              id="feedback"
              placeholder="How can we improve Timkit UI?"
              aria-label="Send feedback"
            />
            <div class="flex flex-col sm:flex-row sm:justify-end">
              <Button size="sm">Send feedback</Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
</template>
