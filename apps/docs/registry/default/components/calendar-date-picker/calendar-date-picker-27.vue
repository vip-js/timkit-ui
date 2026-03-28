<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@timui/core';
import { CalendarIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Calendar } from '@timui/vue';
import { Label } from '@timui/vue';
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue';
import { format } from 'date-fns';


const date = ref<Date | undefined>(undefined);


const id = 'calendar-date-picker-27';


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

</script>

<template>
  <div><div class="*:not-first:mt-2"><Label :htmlFor="id">Date picker</Label><Popover :ids="{ trigger: id }"><PopoverTrigger as-child><Button :id="id" :variant="'outline'" class="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><span :class="cn('truncate', !date && 'text-muted-foreground')"><template v-if="date">
{{ format(date, 'PPP') }}
</template>
<template v-else>
{{ 'Pick a date' }}
</template></span><CalendarIcon :size="16" class="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="w-auto p-2" align="start"><Calendar mode="single" :selected="date" @update:modelValue="setDate" /></PopoverContent></Popover></div><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
