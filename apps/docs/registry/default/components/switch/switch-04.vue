<script setup lang="ts">
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';





const id = 'switch-04';

</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" disabled /><Label :htmlFor="id" class="sr-only">Disabled
      </Label></div>
</template>
