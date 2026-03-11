<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">File input</Label><Input :id="id" class="p-0 pe-3 file:me-3 file:border-0 file:border-e" type="file" /></div>
</template>
