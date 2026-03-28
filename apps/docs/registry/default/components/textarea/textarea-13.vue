<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-13';

</script>

<template>
  <div class="group relative"><Label :htmlFor="id" class="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50">Textarea with overlapping label
      </Label><Textarea :id="id" /></div>
</template>
