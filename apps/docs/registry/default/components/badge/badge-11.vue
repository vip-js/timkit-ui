<script setup lang="ts">
import { ref } from 'vue'
import { Badge } from '@timui/vue';
import { Checkbox } from '@timui/vue';





const id = 'badge-11';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Badge @click="onDemoClick" class="has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative outline-none has-focus-visible:ring-[3px]"><Checkbox :id="id" class="peer sr-only after:absolute after:inset-0" defaultChecked /><svg class="hidden peer-data-[state=checked]:block" :width="12" :height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg><label :for="id" class="cursor-pointer select-none after:absolute after:inset-0">Selectable
      </label></Badge>
</template>
