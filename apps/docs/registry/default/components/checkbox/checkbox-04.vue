<script setup lang="ts">
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-04';

</script>

<template>
  <div class="flex items-center gap-2"><Checkbox :id="id" disabled /><Label :htmlFor="id">Disabled checkbox</Label></div>
</template>
