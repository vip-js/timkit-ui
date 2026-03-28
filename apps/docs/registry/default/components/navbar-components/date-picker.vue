<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@timui/core';
import { CalendarIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Calendar } from '@timui/vue';
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue';
import { format } from 'date-fns';

type CalendarRangeValue = { from?: Date; to?: Date } | undefined

const date = ref<CalendarRangeValue | undefined>(undefined);


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

</script>

<template>
  <Popover><PopoverTrigger as-child><Button variant="outline" size="sm" class="group bg-background border-input w-full justify-between px-3 text-sm font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><CalendarIcon :size="16" class="text-muted-foreground/80 -ms-1 shrink-0 transition-colors" aria-hidden="true" /><span :class="cn('truncate', !date && 'font-medium')"><template v-if="date?.from"><template v-if="date?.to">{{ format(date.from, 'LLL dd, y') }} - {{ format(date.to, 'LLL dd, y') }}</template><template v-else>{{ format(date.from, 'LLL dd, y') }}</template></template><template v-else>
{{ 'Date' }}
</template></span></Button></PopoverTrigger><PopoverContent class="w-auto p-2" align="start"><Calendar mode="range" :selected="date" @update:modelValue="setDate" /></PopoverContent></Popover>
</template>
