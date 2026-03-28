<script setup lang="ts">
import { Label } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';





const id = 'select-23';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Required select <span class="text-destructive">*</span></Label><Select default-value="4" required><SelectTrigger :id="id"><SelectValue placeholder="Select framework" /></SelectTrigger><SelectContent><SelectItem value="1">React</SelectItem><SelectItem value="2">Next.js</SelectItem><SelectItem value="3">Astro</SelectItem><SelectItem value="4">Gatsby</SelectItem></SelectContent></Select></div>
</template>
