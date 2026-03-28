<script setup lang="ts">
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-03';

</script>

<template>
  <div class="flex items-center gap-2 [--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]"><Checkbox :id="id" defaultChecked /><Label :htmlFor="id">Colored checkbox</Label></div>
</template>
