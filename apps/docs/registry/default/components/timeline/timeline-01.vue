<script setup lang="ts">
import { Timeline } from '@/components/ui/timeline';
import { TimelineHeader } from '@/components/ui/timeline-header';
import { TimelineIndicator } from '@/components/ui/timeline-indicator';
import { TimelineItem } from '@/components/ui/timeline-item';
import { TimelineSeparator } from '@/components/ui/timeline-separator';
import { TimelineTitle } from '@/components/ui/timeline-title';



</script>

<template>
  <Timeline :default-value="3"><TimelineItem v-for="(item, index) in items" :key="index" :key="item.id" :step="item.id"><TimelineHeader><TimelineSeparator /><TimelineTitle class="-mt-0.5">{{ item.title }}</TimelineTitle><TimelineIndicator /></TimelineHeader></TimelineItem></Timeline>
</template>
