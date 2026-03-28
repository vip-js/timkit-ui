<script setup lang="ts">
import { Label } from '@timui/vue'
import { Textarea } from '@timui/vue'

const id = 'textarea-15'
</script>

<template>
  <div class="border-input bg-background focus-within:border-ring focus-within:ring-ring/50 relative rounded-md border shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50">
    <Label :htmlFor="id" class="text-foreground block px-3 pt-2 text-xs font-medium">
      Textarea with inset label
    </Label>
    <Textarea :id="id" class="min-h-[70px] rounded-none border-0 px-3 pb-2 shadow-none" />
  </div>
</template>
