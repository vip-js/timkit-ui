<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'

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

const props = withDefaults(
  defineProps<{
    events?: CalendarEvent[]
  }>(),
  {
    events: () => [],
  }
)

const sortedEvents = computed(() => {
  return [...props.events].sort((a, b) => a.start.getTime() - b.start.getTime())
})

const eventColorClass = (color?: CalendarEvent['color']) => {
  switch (color) {
    case 'amber':
      return 'border-amber-200 bg-amber-50 text-amber-900'
    case 'orange':
      return 'border-orange-200 bg-orange-50 text-orange-900'
    case 'emerald':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900'
    case 'violet':
      return 'border-violet-200 bg-violet-50 text-violet-900'
    case 'rose':
      return 'border-rose-200 bg-rose-50 text-rose-900'
    case 'sky':
    default:
      return 'border-sky-200 bg-sky-50 text-sky-900'
  }
}
</script>

<template>
  <div class="rounded-lg border">
    <div class="border-b px-4 py-3">
      <h3 class="text-sm font-semibold">Event Calendar</h3>
      <p class="text-muted-foreground text-xs">Simple Vue fallback implementation for docs preview.</p>
    </div>

    <div v-if="sortedEvents.length === 0" class="text-muted-foreground p-6 text-sm">
      No events found.
    </div>

    <ul v-else class="space-y-2 p-3">
      <li
        v-for="event in sortedEvents"
        :key="event.id"
        class="rounded-md border px-3 py-2"
        :class="eventColorClass(event.color)"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-medium">{{ event.title }}</p>
          <span class="text-xs opacity-80">{{ event.allDay ? 'All day' : format(event.start, 'HH:mm') }}</span>
        </div>
        <p class="mt-0.5 text-xs opacity-80">{{ format(event.start, 'yyyy-MM-dd') }} - {{ format(event.end, 'yyyy-MM-dd') }}</p>
        <p v-if="event.description" class="mt-1 text-xs opacity-80">{{ event.description }}</p>
        <p v-if="event.location" class="mt-1 text-xs opacity-80">{{ event.location }}</p>
      </li>
    </ul>
  </div>
</template>
