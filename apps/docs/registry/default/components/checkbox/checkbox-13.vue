<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="flex items-start gap-2">
      <Checkbox id="checkbox-13-id" class="order-1" aria-describedby="checkbox-13-id-description" />
      <div class="grid grow gap-2">
        <Label for="checkbox-13-id">
          Label 
          <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
            (Sublabel)
          </span>
        </Label>
        <p id="checkbox-13-id" class="text-muted-foreground text-xs">
          You can use this checkbox with a label and a description.
        </p>
      </div>
    </div>
</template>
