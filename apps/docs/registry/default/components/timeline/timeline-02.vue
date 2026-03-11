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
  <Timeline :default-value="3"><TimelineItem v-for="(item, index) in items" :key="index" :key="item.id" :step="item.id" class="group-data-[orientation=vertical]/timeline:sm:ms-32"><TimelineHeader><TimelineSeparator /><TimelineDate class="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">{{ item.date }}</TimelineDate><TimelineTitle class="sm:-mt-0.5">{{ item.title }}</TimelineTitle><TimelineIndicator /></TimelineHeader><TimelineContent>{{ item.description }}</TimelineContent></TimelineItem></Timeline>
</template>
