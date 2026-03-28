<script setup lang="ts">
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';





const id = 'switch-02';

</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" class="h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3" /><Label :htmlFor="id" class="sr-only">Small switch
      </Label></div>
</template>
