<script setup lang="ts">
import { GitCompare, GitFork, GitMerge, GitPullRequest } from 'lucide-vue-next';
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
  <Timeline :default-value="3"><TimelineItem v-for="(item, index) in items" :key="index" :key="item.id" :step="item.id" class="group-data-[orientation=vertical]/timeline:ms-10"><TimelineHeader><TimelineSeparator class="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" /><TimelineTitle class="mt-0.5">{{ item.title }}</TimelineTitle><TimelineIndicator class="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7"><item.icon :size="14" /></TimelineIndicator></TimelineHeader><TimelineContent>{{ item.description }}<TimelineDate class="mt-2 mb-0">{{ item.date }}</TimelineDate></TimelineContent></TimelineItem></Timeline>
</template>
