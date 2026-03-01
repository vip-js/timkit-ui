<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="flex items-center gap-2">
      <Checkbox id="checkbox-07-id" />
      <Label for="checkbox-07-id">
        I agree to the 
        <a class="underline" href="https://ui.timkit.cn" target="_blank">
          terms of service
        </a>
      </Label>
    </div>
</template>
