<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with right button</Label><Textarea :id="id" placeholder="Leave a comment" /><div class="flex justify-end"><Button variant="outline">Send</Button></div></div>
</template>
