<script setup lang="ts">
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-08';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Disabled select (native)</Label><SelectNative :id="id" disabled><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option></SelectNative></div>
</template>
