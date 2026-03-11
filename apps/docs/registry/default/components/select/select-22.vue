<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Disabled select</Label><Select default-value="1" disabled><SelectTrigger :id="id"><SelectValue placeholder="Select framework" /></SelectTrigger><SelectContent><SelectItem value="1">React</SelectItem><SelectItem value="2">Next.js</SelectItem><SelectItem value="3">Astro</SelectItem><SelectItem value="4">Gatsby</SelectItem></SelectContent></Select></div>
</template>
