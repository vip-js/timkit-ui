<script setup lang="ts">
import { ChevronDownIcon, PinIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';



</script>

<template>
  <div class="divide-primary-foreground/30 inline-flex divide-x rounded-md shadow-xs rtl:space-x-reverse"><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" size="icon" aria-label="Options"><ChevronDownIcon :size="16" aria-hidden="true" /></Button><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"><PinIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Pinned
      </Button></div>
</template>
