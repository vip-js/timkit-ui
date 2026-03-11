<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="flex items-center justify-between gap-2"><Checkbox :id="id" class="order-1" /><Label :htmlFor="id">Right aligned checkbox</Label></div>
</template>
