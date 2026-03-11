<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="grid gap-3"><div class="flex items-center gap-2"><Checkbox :id="`${id}-1`" /><Label :htmlFor="`${id}-1`">React</Label></div><div class="flex items-center gap-2"><Checkbox :id="`${id}-2`" /><Label :htmlFor="`${id}-2`">Next.js</Label></div><div class="flex items-center gap-2"><Checkbox :id="`${id}-3`" /><Label :htmlFor="`${id}-3`">Astro</Label></div></div>
</template>
