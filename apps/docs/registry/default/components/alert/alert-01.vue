<script setup lang="ts">
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert-description';



</script>

<template>
  <Alert class="rounded-md border px-4 py-3"><div class="flex gap-3"><span class="me-3 -mt-0.5 inline-flex text-amber-500" aria-hidden="true">!
        </span><AlertDescription class="text-sm text-current">Some information is missing!
        </AlertDescription></div></Alert>
</template>
