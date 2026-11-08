<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-15';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with end add-on</Label><div class="flex rounded-md shadow-xs"><Input @input="onDemoClick" :id="id" class="-me-px rounded-e-none shadow-none" placeholder="google" type="text" /><span class="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">.com
        </span></div></div>
</template>
