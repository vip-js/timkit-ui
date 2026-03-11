<script setup lang="ts">
import { Timeline } from '@/components/ui/timeline';
import { TimelineDate } from '@/components/ui/timeline-date';
import { TimelineHeader } from '@/components/ui/timeline-header';
import { TimelineIndicator } from '@/components/ui/timeline-indicator';
import { TimelineItem } from '@/components/ui/timeline-item';
import { TimelineSeparator } from '@/components/ui/timeline-separator';
import { TimelineTitle } from '@/components/ui/timeline-title';



</script>

<template>
  <Timeline :default-value="3"><TimelineItem v-for="(item, index) in items" :key="index" :key="item.id" :step="item.id" class="w-[calc(50%-1.5rem)] odd:ms-auto even:text-right even:group-data-[orientation=vertical]/timeline:ms-0 even:group-data-[orientation=vertical]/timeline:me-8 even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-indicator]]:-right-6 even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-indicator]]:left-auto even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-indicator]]:translate-x-1/2 even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-separator]]:-right-6 even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-separator]]:left-auto even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-separator]]:translate-x-1/2"><TimelineHeader><TimelineSeparator /><TimelineDate>{{ item.date }}</TimelineDate><TimelineTitle>{{ item.title }}</TimelineTitle><TimelineIndicator /></TimelineHeader></TimelineItem></Timeline>
</template>
