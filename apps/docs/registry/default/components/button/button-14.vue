<script setup lang="ts">
import { LoaderCircleIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';



</script>

<template>
  <Button @click="handleClick" :disabled="isLoading" :data-loading="isLoading || undefined" class="group relative disabled:opacity-100"><span class="group-data-loading:text-transparent">Click me</span><div v-if="isLoading" class="absolute inset-0 flex items-center justify-center"><LoaderCircleIcon class="animate-spin" :size="16" aria-hidden="true" /></div></Button>
</template>
