<script setup lang="ts">
import { Alert } from '@timui/vue';
import { AlertDescription } from '@timui/vue';




</script>

<template>
  <Alert class="rounded-md border px-4 py-3"><div class="flex gap-3"><span class="mt-0.5 shrink-0 text-amber-500" aria-hidden="true">!
        </span><div class="flex grow justify-between gap-3"><AlertDescription class="text-sm text-current">Some information is missing!
          </AlertDescription><a href="#" class="group text-sm font-medium whitespace-nowrap">Link
            <span class="ms-1 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5" aria-hidden="true">-&gt;
            </span></a></div></div></Alert>
</template>
