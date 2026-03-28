<script setup lang="ts">
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';





const id = 'switch-03';

</script>

<template>
  <div class="inline-flex items-center gap-2 [--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]"><Switch :id="id" defaultChecked /><Label :htmlFor="id" class="sr-only">Colored switch
      </Label></div>
</template>
