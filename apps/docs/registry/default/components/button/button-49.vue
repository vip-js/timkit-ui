<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';



</script>

<template>
  <Button class="gap-1" variant="ghost" @click="toggleExpand" :aria-expanded="isExpanded" aria-controls="expandable-content">{{ isExpanded ? 'Show less' : 'Show more' }}{{ isExpanded ? (
        <ChevronUpIcon className="-me-1" size={16} aria-hidden="true" />
      ) : (
        <ChevronDownIcon className="-me-1" size={16} aria-hidden="true" />
      ) }}</Button>
</template>
