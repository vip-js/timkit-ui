<script setup lang="ts">
import { ArrowRightIcon, MailIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';



</script>

<template>
  <Button class="group" variant="secondary"><MailIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Email
      <ArrowRightIcon class="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5" :size="16" aria-hidden="true" /></Button>
</template>
