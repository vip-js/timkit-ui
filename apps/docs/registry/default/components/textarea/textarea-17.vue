<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with no resize</Label><Textarea :id="id" class="[resize:none]" placeholder="Leave a comment" /></div>
</template>
