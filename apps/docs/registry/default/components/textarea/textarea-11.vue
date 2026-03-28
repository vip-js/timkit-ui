<script setup lang="ts">
import { Button } from '@timui/vue';
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-11';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with right button</Label><Textarea :id="id" placeholder="Leave a comment" /><div class="flex justify-end"><Button variant="outline">Send</Button></div></div>
</template>
