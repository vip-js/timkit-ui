<script setup lang="ts">
import { ScrollArea } from '@timui/vue';
import { Separator } from '@timui/vue';

const tags = Array.from({ length: 50 }).map((_, i, arr) => `v1.2.0-beta.${arr.length - i}`);
</script>

<template>
  <ScrollArea class="h-72 w-48 rounded-md border">
    <div class="p-4">
      <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
      <template v-for="tag in tags" :key="tag">
        <div class="text-sm">{{ tag }}</div>
        <Separator class="my-2" />
      </template>
    </div>
  </ScrollArea>
</template>
