<script setup lang="ts">
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';




</script>

<template>
  <div class="*:not-first:mt-4"><Label>Slider with solid thumb</Label><Slider :default-value="[25]" class="[&>:last-child>span]:bg-primary [&>:first-child>span]:opacity-70" aria-label="Slider with solid thumb" /></div>
</template>
