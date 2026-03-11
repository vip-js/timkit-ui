<script setup lang="ts">
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
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Options with flag and search</Label><Popover :open="open" @update:open="setOpen"><PopoverTrigger as-child><Button :id="id" variant="outline" role="combobox" :aria-expanded="open" class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]">{{ value ? (
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-lg leading-none">
                  {
                    countries
                      .map((group) => group.items.find((item) => item.value === value))
                      .filter(Boolean)[0]?.flag
                  }
                </span>
                <span className="truncate">{value}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select country</span>
            ) }}<ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start"><Command><CommandInput placeholder="Search country..." /><CommandList><CommandEmpty>No country found.</CommandEmpty><Fragment v-for="(group, index) in countries" :key="index" :key="group.continent"><CommandGroup :heading="group.continent"><CommandItem v-for="(country, index) in group.items" :key="index" :key="country.value" :value="country.value" :onSelect="(currentValue) => {
                          const val = currentValue as string
                          setValue(val === value ? '' : val)
                          setOpen(false)
                        }"><span class="text-lg leading-none">{{ country.flag }}</span>{{ country.value }}<CheckIcon v-if="value === country.value" :size="16" class="ml-auto" /></CommandItem></CommandGroup></Fragment></CommandList></Command></PopoverContent></Popover></div>
</template>
