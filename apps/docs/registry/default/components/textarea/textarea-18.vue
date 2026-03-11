<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Read-only textarea</Label><Textarea :id="id" class="read-only:bg-muted" default-value="This is a read-only textarea" readOnly placeholder="Leave a comment" /></div>
</template>
