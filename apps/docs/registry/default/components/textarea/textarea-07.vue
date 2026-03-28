<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-07';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with gray background</Label><Textarea :id="id" class="bg-muted border-transparent shadow-none" placeholder="Leave a comment" /></div>
</template>
