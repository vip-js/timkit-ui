<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Shorter textarea</Label><Textarea :id="id" class="min-h-0" placeholder="Leave a comment" :rows="2" /></div>
</template>
