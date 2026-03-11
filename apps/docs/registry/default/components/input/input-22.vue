<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with button</Label><div class="flex gap-2"><Input :id="id" class="flex-1" placeholder="Email" type="email" /><Button variant="outline">Send</Button></div></div>
</template>
