<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue'
import { Textarea } from '@timui/vue'

const id = 'textarea-15'



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="border-input bg-background focus-within:border-ring focus-within:ring-ring/50 relative rounded-md border shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50">
    <Label :htmlFor="id" class="text-foreground block px-3 pt-2 text-xs font-medium">
      Textarea with inset label
    </Label>
    <Textarea @input="onDemoClick" :id="id" class="min-h-[70px] rounded-none border-0 px-3 pb-2 shadow-none" />
  </div>
</template>
