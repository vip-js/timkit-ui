<script setup lang="ts">
import { EventCalendar, CalendarEvent } from '@/registry/default/components/event-calendar.vue';


</script>

<template>
  <EventCalendar :events="events" :onEventAdd="handleEventAdd" :onEventUpdate="handleEventUpdate" :onEventDelete="handleEventDelete" />
</template>
