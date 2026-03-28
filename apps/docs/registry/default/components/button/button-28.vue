<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';




</script>

<template>
  <div class="inline-flex -space-x-px rounded-full shadow-xs rtl:space-x-reverse"><Button class="rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10" size="icon" aria-label="Upvote"><ChevronUpIcon :size="16" aria-hidden="true" /></Button><span class="bg-primary text-primary-foreground flex items-center px-1 text-sm font-medium">235
      </span><Button class="rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10" size="icon" aria-label="Downvote"><ChevronDownIcon :size="16" aria-hidden="true" /></Button></div>
</template>
