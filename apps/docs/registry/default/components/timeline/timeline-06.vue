<script setup lang="ts">
import { GitCompare, GitFork, GitMerge, GitPullRequest } from 'lucide-vue-next';
import { Timeline } from '@timui/vue';
import { TimelineContent } from '@timui/vue';
import { TimelineDate } from '@timui/vue';
import { TimelineHeader } from '@timui/vue';
import { TimelineIndicator } from '@timui/vue';
import { TimelineItem } from '@timui/vue';
import { TimelineSeparator } from '@timui/vue';
import { TimelineTitle } from '@timui/vue';





const items = [
  {
    id: 1,
    date: '15 minutes ago',
    title: 'Forked Repository',
    description: 'Forked the repository to create a new branch for development.',
    icon: GitFork,
  },
  {
    id: 2,
    date: '10 minutes ago',
    title: 'Pull Request Submitted',
    description:
      'Submitted PR #342 with new feature implementation. Waiting for code review from team leads.',
    icon: GitPullRequest,
  },
  {
    id: 3,
    date: '5 minutes ago',
    title: 'Comparing Branches',
    description:
      'Received comments on PR. Minor adjustments needed in error handling and documentation.',
    icon: GitCompare,
  },
  {
    id: 4,
    title: 'Merged Branch',
    description: 'Merged the feature branch into the main branch. Ready for deployment.',
    icon: GitMerge,
  },
]

</script>

<template>
  <Timeline :default-value="3"><TimelineItem v-for="(item, index) in items" :key="item.id" :step="item.id" class="group-data-[orientation=vertical]/timeline:ms-10"><TimelineHeader><TimelineSeparator class="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" /><TimelineTitle class="mt-0.5">{{ item.title }}</TimelineTitle><TimelineIndicator class="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7"><item.icon :size="14" /></TimelineIndicator></TimelineHeader><TimelineContent>{{ item.description }}<TimelineDate class="mt-2 mb-0">{{ item.date }}</TimelineDate></TimelineContent></TimelineItem></Timeline>
</template>
