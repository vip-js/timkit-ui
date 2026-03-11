<script setup lang="ts">
import { FlipHorizontalIcon, FlipVerticalIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';



</script>

<template>
  <div class="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse"><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" variant="outline" size="icon" aria-label="Flip Horizontal"><FlipHorizontalIcon :size="16" aria-hidden="true" /></Button><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" variant="outline" size="icon" aria-label="Flip Vertical"><FlipVerticalIcon :size="16" aria-hidden="true" /></Button></div>
</template>
