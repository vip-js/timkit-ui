<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
      <Checkbox id="checkbox-14-id"
        class="order-1 after:absolute after:inset-0" aria-describedby="checkbox-14-id-description"
      />
      <div class="grid grow gap-2">
        <Label for="checkbox-14-id">
          Label 
          <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
            (Sublabel)
          </span>
        </Label>
        <p id="checkbox-14-id" class="text-muted-foreground text-xs">
          A short description goes here.
        </p>
      </div>
    </div>
</template>
