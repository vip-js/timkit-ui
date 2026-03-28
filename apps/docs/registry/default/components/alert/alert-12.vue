<script setup lang="ts">
import { Alert } from '@timui/vue';
import { AlertDescription } from '@timui/vue';
import { AlertTitle } from '@timui/vue';




</script>

<template>
  <Alert class="rounded-md border border-red-500/50 px-4 py-3 text-red-600"><div class="flex gap-3"><span class="mt-0.5 shrink-0 opacity-60" aria-hidden="true">!
        </span><div class="grow space-y-1"><AlertTitle class="text-sm font-medium text-current">Password does not meet requirements:
          </AlertTitle><ul class="list-inside list-disc text-sm opacity-80"><li>Minimum 8 characters</li><li>Inlcude a special character</li></ul></div></div></Alert>
</template>
