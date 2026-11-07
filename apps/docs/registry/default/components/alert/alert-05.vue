<script setup lang="ts">
import { ref } from 'vue'
import { Alert } from '@timui/vue';
import { AlertDescription } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Alert @click="onDemoClick" class="rounded-md border px-4 py-3"><div class="flex gap-3"><span class="me-3 -mt-0.5 inline-flex text-emerald-500" aria-hidden="true">!
        </span><AlertDescription class="text-sm text-current">Completed successfully!
        </AlertDescription></div></Alert>
</template>
