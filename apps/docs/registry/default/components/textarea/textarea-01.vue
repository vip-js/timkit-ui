<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-01';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Simple textarea</Label><Textarea :id="id" placeholder="Leave a comment" /></div>
</template>
