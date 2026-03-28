<script setup lang="ts">
import { Button } from '@timui/vue';
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-12';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with button</Label><Textarea :id="id" placeholder="Leave a comment" /><Button variant="outline" class="w-full">Send
      </Button></div>
</template>
