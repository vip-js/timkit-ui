<script setup lang="ts">
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="group relative">
      <label for="input-31-id"
        class="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
      >
        Input with overlapping label
      </label>
      <Input id="input-31-id" class="h-10" placeholder="Email" type="email" />
    </div>
</template>
