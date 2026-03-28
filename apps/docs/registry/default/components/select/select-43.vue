<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@timui/core';
import { CheckIcon, ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Command } from '@timui/vue';
import { CommandEmpty } from '@timui/vue';
import { CommandGroup } from '@timui/vue';
import { CommandInput } from '@timui/vue';
import { CommandItem } from '@timui/vue';
import { CommandList } from '@timui/vue';
import { Label } from '@timui/vue';
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue';



const open = ref<boolean>(false);
const value = ref<string>('Europe/London');


function setValue(next: typeof value.value | ((prev: typeof value.value) => typeof value.value)) {
  value.value = typeof next === 'function'
    ? (next as (prev: typeof value.value) => typeof value.value)(value.value)
    : next;
}

function setOpen(next: typeof open.value | ((prev: typeof open.value) => typeof open.value)) {
  open.value = typeof next === 'function'
    ? (next as (prev: typeof open.value) => typeof open.value)(open.value)
    : next;
}


const id = 'select-43';


const timezones = Intl.supportedValuesOf('timeZone');
const formattedTimezones = timezones
  .map((timezone) => {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(new Date());
    const offset = parts.find((part) => part.type === 'timeZoneName')?.value || '';
    const modifiedOffset = offset === 'GMT' ? 'GMT+0' : offset;

    return {
      value: timezone,
      label: `(${modifiedOffset}) ${timezone.replace(/_/g, ' ')}`,
      numericOffset: parseInt(offset.replace('GMT', '').replace('+', '') || '0'),
    };
  })
  .sort((a, b) => a.numericOffset - b.numericOffset);

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Timezone select with search</Label><Popover :open="open" @update:open="setOpen"><PopoverTrigger as-child><Button :id="id" variant="outline" role="combobox" :aria-expanded="open" class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><span :class="cn('truncate', !value && 'text-muted-foreground')"><template v-if="value">
{{ formattedTimezones.find((timezone) => timezone.value === value)?.label }}
</template>
<template v-else>
{{ 'Select timezone' }}
</template></span><ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start"><Command :filter="(value, search) => {
              const normalizedValue = value.toLowerCase()
              const normalizedSearch = search.toLowerCase().replace(/\s+/g, '')
              return normalizedValue.includes(normalizedSearch) ? 1 : 0
            }"><CommandInput placeholder="Search timezone..." /><CommandList><CommandEmpty>No timezone found.</CommandEmpty><CommandGroup><CommandItem v-for="({ value: itemValue, label }, index) in formattedTimezones" :key="itemValue" :value="itemValue" :onSelect="(currentValue) => {
                      const val = currentValue as string
                      setValue(val === value ? '' : val)
                      setOpen(false)
                    }">{{ label }}<CheckIcon v-if="value === itemValue" :size="16" class="ml-auto" /></CommandItem></CommandGroup></CommandList></Command></PopoverContent></Popover></div>
</template>
