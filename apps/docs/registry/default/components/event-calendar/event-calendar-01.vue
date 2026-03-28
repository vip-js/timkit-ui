<script setup lang="ts">
import { ref } from 'vue'
import { addDays, setHours, setMinutes, subDays } from 'date-fns'
import { Button } from '@timui/vue'
import EventCalendar from '@/registry/default/components/event-calendar/event-calendar.vue'

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  color?: 'sky' | 'amber' | 'orange' | 'emerald' | 'violet' | 'rose'
  description?: string
  location?: string
}

const events = ref<CalendarEvent[]>([
  {
    id: '1',
    title: 'Annual Planning',
    description: 'Strategic planning for next year',
    start: subDays(new Date(), 2),
    end: subDays(new Date(), 1),
    allDay: true,
    color: 'sky',
    location: 'Main Conference Hall',
  },
  {
    id: '2',
    title: 'Team Meeting',
    description: 'Weekly sync',
    start: setMinutes(setHours(new Date(), 10), 0),
    end: setMinutes(setHours(new Date(), 11), 0),
    color: 'amber',
    location: 'Conference Room A',
  },
  {
    id: '3',
    title: 'Product Launch',
    start: addDays(new Date(), 3),
    end: addDays(new Date(), 4),
    allDay: true,
    color: 'violet',
  },
])

const addEvent = () => {
  const id = String(Date.now())
  events.value = [
    ...events.value,
    {
      id,
      title: `New Event ${events.value.length + 1}`,
      start: addDays(new Date(), 1),
      end: addDays(new Date(), 1),
      allDay: true,
      color: 'emerald',
    },
  ]
}

const removeLast = () => {
  events.value = events.value.slice(0, -1)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <Button size="sm" variant="outline" @click="addEvent">Add event</Button>
      <Button size="sm" variant="outline" :disabled="events.length === 0" @click="removeLast">
        Remove last
      </Button>
    </div>
    <EventCalendar :events="events" />
  </div>
</template>
