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
  <Alert @click="onDemoClick" class="rounded-md border border-emerald-500/50 px-4 py-3 text-emerald-600"><div class="flex gap-3"><span class="me-3 -mt-0.5 inline-flex opacity-60" aria-hidden="true">!
        </span><AlertDescription class="text-sm text-current">Completed successfully!
        </AlertDescription></div></Alert>
</template>
