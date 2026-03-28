<script setup lang="ts">
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@timui/vue'
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
