<script setup lang="ts">
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-02';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with placeholder (native)</Label><SelectNative :id="id" default-value=""><option value="" disabled>Please select a value
        </option><option value="1">1 to 5</option><option value="2">5 to 10</option><option value="3">More than 10</option></SelectNative></div>
</template>
