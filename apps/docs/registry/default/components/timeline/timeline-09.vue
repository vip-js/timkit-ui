<script setup lang="ts">
import { Timeline } from '@/components/ui/timeline';
import { TimelineContent } from '@/components/ui/timeline-content';
import { TimelineDate } from '@/components/ui/timeline-date';
import { TimelineItem } from '@/components/ui/timeline-item';



</script>

<template>
  <Timeline class="divide-y rounded-lg border"><TimelineItem v-for="(item, index) in items" :key="index" :key="item.id" :step="item.id" class="m-0! px-4! py-3!"><TimelineContent class="text-foreground">{{ item.description }}<TimelineDate class="mt-1">{{ item.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) }}{{ ' ' }}at{{ ' ' }}{{ item.date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }) }}</TimelineDate></TimelineContent></TimelineItem></Timeline>
</template>
