<script setup lang="ts">
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-10';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with auto-width (native)</Label><div class="w-fit"><SelectNative :id="id"><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option></SelectNative></div></div>
</template>
