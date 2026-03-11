<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Command } from '@/components/ui/command';
import { CommandEmpty } from '@/components/ui/command-empty';
import { CommandGroup } from '@/components/ui/command-group';
import { CommandInput } from '@/components/ui/command-input';
import { CommandItem } from '@/components/ui/command-item';
import { CommandList } from '@/components/ui/command-list';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Timezone select with search</Label><Popover :open="open" @update:open="setOpen"><PopoverTrigger as-child><Button :id="id" variant="outline" role="combobox" :aria-expanded="open" class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><span :class="cn('truncate', !value && 'text-muted-foreground')">{{ value
                ? formattedTimezones.find((timezone) => timezone.value === value)?.label
                : 'Select timezone' }}</span><ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start"><Command :filter="(value, search) => {
              const normalizedValue = value.toLowerCase()
              const normalizedSearch = search.toLowerCase().replace(/\s+/g, '')
              return normalizedValue.includes(normalizedSearch) ? 1 : 0
            }"><CommandInput placeholder="Search timezone..." /><CommandList><CommandEmpty>No timezone found.</CommandEmpty><CommandGroup><CommandItem v-for="({ value: itemValue, label }, index) in formattedTimezones" :key="index" :key="itemValue" :value="itemValue" :onSelect="(currentValue) => {
                      const val = currentValue as string
                      setValue(val === value ? '' : val)
                      setOpen(false)
                    }">{{ label }}<CheckIcon v-if="value === itemValue" :size="16" class="ml-auto" /></CommandItem></CommandGroup></CommandList></Command></PopoverContent></Popover></div>
</template>
