<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="flex items-center gap-2">
      <Checkbox id="checkbox-05-id" checked />
      <Label for="checkbox-05-id" class="peer-data-[state=checked]:line-through">
        Simple todo item
      </Label>
    </div>
</template>
