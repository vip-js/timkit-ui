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
const value = ref<string>('');


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


const id = 'select-41';


const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
  {
    value: 'angular',
    label: 'Angular',
  },
  {
    value: 'vue',
    label: 'Vue.js',
  },
  {
    value: 'react',
    label: 'React',
  },
  {
    value: 'ember',
    label: 'Ember.js',
  },
  {
    value: 'gatsby',
    label: 'Gatsby',
  },
  {
    value: 'eleventy',
    label: 'Eleventy',
  },
  {
    value: 'solid',
    label: 'SolidJS',
  },
  {
    value: 'preact',
    label: 'Preact',
  },
  {
    value: 'qwik',
    label: 'Qwik',
  },
  {
    value: 'alpine',
    label: 'Alpine.js',
  },
  {
    value: 'lit',
    label: 'Lit',
  },
]

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with search</Label><Popover :open="open" @update:open="setOpen"><PopoverTrigger as-child><Button :id="id" variant="outline" role="combobox" :aria-expanded="open" class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><span :class="cn('truncate', !value && 'text-muted-foreground')"><template v-if="value">
{{ frameworks.find((framework) => framework.value === value)?.label }}
</template>
<template v-else>
{{ 'Select framework' }}
</template></span><ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start"><Command><CommandInput placeholder="Search framework..." /><CommandList><CommandEmpty>No framework found.</CommandEmpty><CommandGroup><CommandItem v-for="(framework, index) in frameworks" :key="framework.value" :value="framework.value" :onSelect="(currentValue) => {
                      const val = currentValue as string
                      setValue(val === value ? '' : val)
                      setOpen(false)
                    }">{{ framework.label }}<CheckIcon v-if="value === framework.value" :size="16" class="ml-auto" /></CommandItem></CommandGroup></CommandList></Command></PopoverContent></Popover></div>
</template>
