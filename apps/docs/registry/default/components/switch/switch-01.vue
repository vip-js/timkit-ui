<script setup lang="ts">
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';





const id = 'switch-01';

</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" /><Label :htmlFor="id" class="sr-only">Simple switch
      </Label></div>
</template>
