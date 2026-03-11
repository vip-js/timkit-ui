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
  <Timeline :default-value="3" orientation="horizontal"><TimelineItem v-for="(item, index) in items" :key="index" :key="item.id" :step="item.id" class="group-data-[orientation=horizontal]/timeline:mt-0"><TimelineHeader><TimelineSeparator class="group-data-[orientation=horizontal]/timeline:top-8" /><TimelineDate class="mb-10">{{ item.date }}</TimelineDate><TimelineTitle>{{ item.title }}</TimelineTitle><TimelineIndicator class="group-data-[orientation=horizontal]/timeline:top-8" /></TimelineHeader><TimelineContent>{{ item.description }}</TimelineContent></TimelineItem></Timeline>
</template>
