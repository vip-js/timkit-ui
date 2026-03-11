<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Required textarea <span class="text-destructive">*</span></Label><Textarea :id="id" placeholder="Leave a message" required /></div>
</template>
