<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-03';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with helper text</Label><Textarea :id="id" placeholder="Leave a comment" /><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Please add as many details as you can
      </p></div>
</template>
