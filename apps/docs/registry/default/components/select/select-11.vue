<script setup lang="ts">
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-11';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with option groups (native)</Label><SelectNative :id="id"><optgroup label="Frontend"><option value="1">React</option><option value="2">Vue</option><option value="3">Angular</option></optgroup><optgroup label="Backend"><option value="4">Node.js</option><option value="5">Python</option><option value="6">Java</option></optgroup></SelectNative></div>
</template>
