<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with button</Label><Textarea :id="id" placeholder="Leave a comment" /><Button variant="outline" class="w-full">Send
      </Button></div>
</template>
