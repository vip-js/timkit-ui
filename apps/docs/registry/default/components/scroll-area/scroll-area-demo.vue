<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';



</script>

<template>
  <ScrollArea class="h-72 w-48 rounded-md border"><div class="p-4"><h4 class="mb-4 text-sm font-medium leading-none">Tags</h4><React v-for="(tag, index) in tags" :key="index" .Fragment :key="tag"><div class="text-sm">{{ tag }}</div><Separator class="my-2" /></React.Fragment></div></ScrollArea>
</template>
