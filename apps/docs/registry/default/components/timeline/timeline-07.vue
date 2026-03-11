<script setup lang="ts">
import { Timeline } from '@/components/ui/timeline';
import { TimelineContent } from '@/components/ui/timeline-content';
import { TimelineDate } from '@/components/ui/timeline-date';
import { TimelineHeader } from '@/components/ui/timeline-header';
import { TimelineIndicator } from '@/components/ui/timeline-indicator';
import { TimelineItem } from '@/components/ui/timeline-item';
import { TimelineSeparator } from '@/components/ui/timeline-separator';
import { TimelineTitle } from '@/components/ui/timeline-title';



</script>

<template>
  <Timeline><TimelineItem v-for="(item, index) in items" :key="index" :key="item.id" :step="item.id" class="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-8"><TimelineHeader><TimelineSeparator class="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" /><TimelineTitle class="mt-0.5">{{ item.title }}{{ ' ' }}<span class="text-muted-foreground text-sm font-normal">{{ item.action }}</span></TimelineTitle><TimelineIndicator class="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7"><img :src="item.image" :alt="item.title" class="size-6 rounded-full" /></TimelineIndicator></TimelineHeader><TimelineContent class="text-foreground mt-2 rounded-lg border px-4 py-3">{{ item.description }}<TimelineDate class="mt-1 mb-0">{{ item.date }}</TimelineDate></TimelineContent></TimelineItem></Timeline>
</template>
