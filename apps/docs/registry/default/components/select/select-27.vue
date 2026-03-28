<script setup lang="ts">
import { Label } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';





const id = 'select-27';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with disabled options</Label><Select default-value="2"><SelectTrigger :id="id"><SelectValue placeholder="Select framework" /></SelectTrigger><SelectContent><SelectItem value="1" disabled>React
          </SelectItem><SelectItem value="2">Next.js</SelectItem><SelectItem value="3" disabled>Astro
          </SelectItem><SelectItem value="4">Gatsby</SelectItem></SelectContent></Select></div>
</template>
