<script setup lang="ts">
import { BlocksIcon, BrainIcon, ChevronDownIcon, CpuIcon, DatabaseIcon, GlobeIcon, LayoutIcon, LineChartIcon, NetworkIcon, SearchIcon, ServerIcon } from 'lucide-vue-next';
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
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Options with icon and number</Label><Popover :open="open" @update:open="setOpen"><PopoverTrigger as-child><Button :id="id" variant="outline" role="combobox" :aria-expanded="open" class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]">{{ value ? (
              <span className="flex min-w-0 items-center gap-2">
                {(() => {
                  const selectedItem = items.find((item) => item.value === value)
                  if (selectedItem) {
                    const Icon = selectedItem.icon
                    return <Icon className="text-muted-foreground size-4" />
                  }
                  return null
                })()}
                <span className="truncate">
                  {items.find((item) => item.value === value)?.label}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select service category</span>
            ) }}<ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start"><Command><CommandInput placeholder="Search services..." /><CommandList><CommandEmpty>No service found.</CommandEmpty><CommandGroup><CommandItem v-for="(item, index) in items" :key="index" :key="item.value" :value="item.value" :onSelect="(currentValue) => {
                      const val = currentValue as string
                      setValue(val === value ? '' : val)
                      setOpen(false)
                    }" class="flex items-center justify-between"><div class="flex items-center gap-2"><item.icon class="text-muted-foreground size-4" />{{ item.label }}</div><span class="text-muted-foreground text-xs">{{ item.number.toLocaleString() }}</span></CommandItem></CommandGroup></CommandList></Command></PopoverContent></Popover></div>
</template>
