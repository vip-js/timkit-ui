<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-08';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Shorter textarea</Label><Textarea :id="id" class="min-h-0" placeholder="Leave a comment" :rows="2" /></div>
</template>
