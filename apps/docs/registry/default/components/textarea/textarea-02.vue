<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-02';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Required textarea <span class="text-destructive">*</span></Label><Textarea :id="id" placeholder="Leave a message" required /></div>
</template>
