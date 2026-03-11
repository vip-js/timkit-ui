<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';



</script>

<template>
  <div class="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]"><Label :htmlFor="id">Textarea with colored border and ring</Label><Textarea :id="id" placeholder="Leave a comment" /></div>
</template>
