<script setup lang="ts">
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-04';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with helper text (native)</Label><SelectNative :id="id"><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option></SelectNative><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Tell us what&lsquo;s your favorite Select framework
      </p></div>
</template>
