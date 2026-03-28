<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-17';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with no resize</Label><Textarea :id="id" class="[resize:none]" placeholder="Leave a comment" /></div>
</template>
