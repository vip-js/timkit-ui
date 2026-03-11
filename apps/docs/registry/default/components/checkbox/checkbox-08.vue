<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="flex gap-6"><div class="flex items-center gap-2"><Checkbox :id="`${id}-a`" /><Label :htmlFor="`${id}-a`">React</Label></div><div class="flex items-center gap-2"><Checkbox :id="`${id}-b`" /><Label :htmlFor="`${id}-b`">Next.js</Label></div><div class="flex items-center gap-2"><Checkbox :id="`${id}-c`" /><Label :htmlFor="`${id}-c`">Astro</Label></div></div>
</template>
