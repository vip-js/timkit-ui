<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-09';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Disabled textarea</Label><Textarea :id="id" disabled placeholder="Leave a comment" /></div>
</template>
