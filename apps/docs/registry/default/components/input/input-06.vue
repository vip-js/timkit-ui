<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-06';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with error</Label><Input @input="onDemoClick" :id="id" class="peer" placeholder="Email" type="email" default-value="invalid@email.com" aria-invalid /><p class="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">Email is invalid
      </p></div>
</template>
