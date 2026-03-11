<script setup lang="ts">
import Timeline from '@/components/ui/timeline/timeline.vue'
import TimelineContent from '@/components/ui/timeline/timeline-content.vue'
import TimelineDate from '@/components/ui/timeline/timeline-date.vue'
import TimelineHeader from '@/components/ui/timeline/timeline-header.vue'
import TimelineIndicator from '@/components/ui/timeline/timeline-indicator.vue'
import TimelineItem from '@/components/ui/timeline/timeline-item.vue'
import TimelineSeparator from '@/components/ui/timeline/timeline-separator.vue'
import TimelineTitle from '@/components/ui/timeline/timeline-title.vue'
</script>

<template>
  <Timeline class="max-w-md">
    <TimelineItem :step="1">
      <TimelineHeader>
        <TimelineIndicator />
        <TimelineDate>Week 1</TimelineDate>
        <TimelineTitle>Audit</TimelineTitle>
      </TimelineHeader>
      <TimelineContent>Compare manifests, registry exports, and docs coverage.</TimelineContent>
      <TimelineSeparator />
    </TimelineItem>
    <TimelineItem :step="2">
      <TimelineHeader>
        <TimelineIndicator />
        <TimelineDate>Week 2</TimelineDate>
        <TimelineTitle>Adapters</TimelineTitle>
      </TimelineHeader>
      <TimelineContent>Add HTML adapter coverage and tighten capability truth.</TimelineContent>
    </TimelineItem>
  </Timeline>
</template>
