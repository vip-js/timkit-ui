<script setup lang="ts">
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';





const id = 'switch-05';

</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" class="rounded-sm [&_span]:rounded" /><Label :htmlFor="id" class="sr-only">Square switch
      </Label></div>
</template>
