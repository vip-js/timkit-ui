<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';



</script>

<template>
  <Button class="group rounded-full" variant="outline" size="icon" @click="setOpen((prevState) => !prevState)" :aria-expanded="open" :aria-label="open ? 'Close menu' : 'Open menu'"><PlusIcon class="transition-transform duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-aria-expanded:rotate-[135deg]" :size="16" aria-hidden="true" /></Button>
</template>
