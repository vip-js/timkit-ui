<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';



</script>

<template>
  <Button class="rounded-full" variant="outline" size="icon" aria-label="Add new item"><PlusIcon :size="16" aria-hidden="true" /></Button>
</template>
