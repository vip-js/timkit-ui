<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckIcon, ChevronDownIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Command } from '@timui/vue'
import { CommandEmpty } from '@timui/vue'
import { CommandGroup } from '@timui/vue'
import { CommandInput } from '@timui/vue'
import { CommandItem } from '@timui/vue'
import { CommandList } from '@timui/vue'
import { Label } from '@timui/vue'
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue'

const open = ref<boolean>(false)
const value = ref<string>('')
const id = 'select-44'

const countries = [
  {
    continent: 'America',
    items: [
      { value: 'United States', flag: '🇺🇸' },
      { value: 'Canada', flag: '🇨🇦' },
      { value: 'Mexico', flag: '🇲🇽' },
    ],
  },
  {
    continent: 'Africa',
    items: [
      { value: 'South Africa', flag: '🇿🇦' },
      { value: 'Nigeria', flag: '🇳🇬' },
      { value: 'Morocco', flag: '🇲🇦' },
    ],
  },
  {
    continent: 'Asia',
    items: [
      { value: 'China', flag: '🇨🇳' },
      { value: 'Japan', flag: '🇯🇵' },
      { value: 'India', flag: '🇮🇳' },
    ],
  },
  {
    continent: 'Europe',
    items: [
      { value: 'United Kingdom', flag: '🇬🇧' },
      { value: 'France', flag: '🇫🇷' },
      { value: 'Germany', flag: '🇩🇪' },
    ],
  },
  {
    continent: 'Oceania',
    items: [
      { value: 'Australia', flag: '🇦🇺' },
      { value: 'New Zealand', flag: '🇳🇿' },
    ],
  },
]

const selectedFlag = computed(() => {
  return (
    countries
      .map((group) => group.items.find((item) => item.value === value.value))
      .filter(Boolean)[0]?.flag ?? ''
  )
})

const handleSelect = (selected: string) => {
  value.value = selected === value.value ? '' : selected
  open.value = false
}
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Options with flag and search</Label>
    <Popover :open="open" @update:open="open = $event">
      <PopoverTrigger as-child>
        <Button
          :id="id"
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
        >
          <template v-if="value">
            <span class="flex min-w-0 items-center gap-2">
              <span class="text-lg leading-none">{{ selectedFlag }}</span>
              <span class="truncate">{{ value }}</span>
            </span>
          </template>
          <template v-else>
            <span class="text-muted-foreground">Select country</span>
          </template>
          <ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <template v-for="group in countries" :key="group.continent">
              <CommandGroup :heading="group.continent">
                <CommandItem
                  v-for="country in group.items"
                  :key="country.value"
                  :value="country.value"
                  :onSelect="handleSelect"
                >
                  <span class="text-lg leading-none">{{ country.flag }}</span> {{ country.value }}
                  <CheckIcon v-if="value === country.value" :size="16" class="ml-auto" />
                </CommandItem>
              </CommandGroup>
            </template>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
