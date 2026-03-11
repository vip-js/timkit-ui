<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Required input <span class="text-destructive">*</span></Label><Input :id="id" placeholder="Email" type="email" required /></div>
</template>
