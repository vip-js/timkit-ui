<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon, PlusIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Command } from '@/components/ui/command';
import { CommandEmpty } from '@/components/ui/command-empty';
import { CommandGroup } from '@/components/ui/command-group';
import { CommandInput } from '@/components/ui/command-input';
import { CommandItem } from '@/components/ui/command-item';
import { CommandList } from '@/components/ui/command-list';
import { CommandSeparator } from '@/components/ui/command-separator';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with search and button</Label><Popover :open="open" @update:open="setOpen"><PopoverTrigger as-child><Button :id="id" variant="outline" role="combobox" :aria-expanded="open" class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><span :class="cn('truncate', !value && 'text-muted-foreground')">{{ value
                ? organizations.find((organization) => organization.value === value)?.label
                : 'Select organization' }}</span><ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start"><Command><CommandInput placeholder="Find organization" /><CommandList><CommandEmpty>No organization found.</CommandEmpty><CommandGroup><CommandItem v-for="(organization, index) in organizations" :key="index" :key="organization.value" :value="organization.value" :onSelect="(currentValue) => {
                      const val = currentValue as string
                      setValue(val === value ? '' : val)
                      setOpen(false)
                    }">{{ organization.label }}<CheckIcon v-if="value === organization.value" :size="16" class="ml-auto" /></CommandItem></CommandGroup><CommandSeparator /><CommandGroup><Button variant="ghost" class="w-full justify-start font-normal"><PlusIcon :size="16" class="-ms-2 opacity-60" aria-hidden="true" />New organization
                </Button></CommandGroup></CommandList></Command></PopoverContent></Popover></div>
</template>
