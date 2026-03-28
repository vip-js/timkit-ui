<script setup lang="ts">
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-10';

</script>

<template>
  <div class="flex items-center justify-between gap-2"><Checkbox :id="id" class="order-1" /><Label :htmlFor="id">Right aligned checkbox</Label></div>
</template>
