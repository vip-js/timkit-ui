<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-04';

</script>

<template>
  <div class="*:not-first:mt-2"><div class="flex items-center justify-between gap-1"><Label :htmlFor="id" class="leading-6">Textarea with hint
        </Label><span class="text-muted-foreground text-sm">Optional</span></div><Textarea :id="id" placeholder="Leave a comment" /></div>
</template>
