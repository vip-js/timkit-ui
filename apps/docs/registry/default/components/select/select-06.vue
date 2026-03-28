<script setup lang="ts">
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-06';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with error (native)</Label><SelectNative :id="id" aria-invalid><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option></SelectNative><p class="text-destructive mt-2 text-xs" role="alert" aria-live="polite">Selected option is invalid
      </p></div>
</template>
