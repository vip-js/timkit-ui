<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="flex items-center gap-2"><Checkbox :id="id" /><Label :htmlFor="id">Simple checkbox</Label></div>
</template>
