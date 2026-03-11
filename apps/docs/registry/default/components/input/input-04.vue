<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="*:not-first:mt-2"><div class="flex items-center justify-between gap-1"><Label :htmlFor="id" class="leading-6">Input with hint
        </Label><span class="text-muted-foreground text-sm">Optional</span></div><Input :id="id" placeholder="Email" type="email" /></div>
</template>
