<script setup lang="ts">
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-01';

</script>

<template>
  <div class="flex items-center gap-2"><Checkbox :id="id" /><Label :htmlFor="id">Simple checkbox</Label></div>
</template>
