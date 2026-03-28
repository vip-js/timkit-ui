<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@timui/core';
import { CheckIcon, ChevronDownIcon, PlusIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Command } from '@timui/vue';
import { CommandEmpty } from '@timui/vue';
import { CommandGroup } from '@timui/vue';
import { CommandInput } from '@timui/vue';
import { CommandItem } from '@timui/vue';
import { CommandList } from '@timui/vue';
import { CommandSeparator } from '@timui/vue';
import { Label } from '@timui/vue';
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue';



const open = ref<boolean>(false);
const value = ref<string>('originui');


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


const id = 'select-42';


const organizations = [
  {
    value: 'originui',
    label: 'Timkit UI',
  },
  {
    value: 'cruip',
    label: 'Cruip',
  },
]

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with search and button</Label><Popover :open="open" @update:open="setOpen"><PopoverTrigger as-child><Button :id="id" variant="outline" role="combobox" :aria-expanded="open" class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><span :class="cn('truncate', !value && 'text-muted-foreground')"><template v-if="value">
{{ organizations.find((organization) => organization.value === value)?.label }}
</template>
<template v-else>
{{ 'Select organization' }}
</template></span><ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start"><Command><CommandInput placeholder="Find organization" /><CommandList><CommandEmpty>No organization found.</CommandEmpty><CommandGroup><CommandItem v-for="(organization, index) in organizations" :key="organization.value" :value="organization.value" :onSelect="(currentValue) => {
                      const val = currentValue as string
                      setValue(val === value ? '' : val)
                      setOpen(false)
                    }">{{ organization.label }}<CheckIcon v-if="value === organization.value" :size="16" class="ml-auto" /></CommandItem></CommandGroup><CommandSeparator /><CommandGroup><Button variant="ghost" class="w-full justify-start font-normal"><PlusIcon :size="16" class="-ms-2 opacity-60" aria-hidden="true" />New organization
                </Button></CommandGroup></CommandList></Command></PopoverContent></Popover></div>
</template>
