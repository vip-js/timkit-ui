<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with gray background (native)</Label><SelectNative :id="id" class="bg-muted border-transparent shadow-none"><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option></SelectNative></div>
</template>
