<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BlocksIcon,
  BrainIcon,
  ChevronDownIcon,
  CpuIcon,
  DatabaseIcon,
  GlobeIcon,
  LayoutIcon,
  LineChartIcon,
  NetworkIcon,
  SearchIcon,
  ServerIcon,
} from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Command } from '@timui/vue'
import { CommandEmpty } from '@timui/vue'
import { CommandGroup } from '@timui/vue'
import { CommandInput } from '@timui/vue'
import { CommandItem } from '@timui/vue'
import { CommandList } from '@timui/vue'
import { Label } from '@timui/vue'
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue'

const items = [
  { value: 'analytics platform', label: 'Analytics Platform', icon: LineChartIcon, number: 2451 },
  { value: 'ai services', label: 'AI Services', icon: BrainIcon, number: 1832 },
  { value: 'database systems', label: 'Database Systems', icon: DatabaseIcon, number: 1654 },
  { value: 'compute resources', label: 'Compute Resources', icon: CpuIcon, number: 943 },
  { value: 'network services', label: 'Network Services', icon: NetworkIcon, number: 832 },
  { value: 'web services', label: 'Web Services', icon: GlobeIcon, number: 654 },
  { value: 'monitoring tools', label: 'Monitoring Tools', icon: SearchIcon, number: 432 },
  { value: 'server management', label: 'Server Management', icon: ServerIcon, number: 321 },
  { value: 'infrastructure', label: 'Infrastructure', icon: BlocksIcon, number: 234 },
  { value: 'frontend services', label: 'Frontend Services', icon: LayoutIcon, number: 123 },
]

const id = 'select-45'
const open = ref(false)
const value = ref('')

const selectedItem = computed(() => items.find((item) => item.value === value.value))

const onSelect = (nextValue: string) => {
  value.value = nextValue === value.value ? '' : nextValue
  open.value = false
}
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Options with icon and number</Label>

    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          :id="id"
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
        >
          <span v-if="selectedItem" class="flex min-w-0 items-center gap-2">
            <component :is="selectedItem.icon" class="text-muted-foreground size-4" />
            <span class="truncate">{{ selectedItem.label }}</span>
          </span>
          <span v-else class="text-muted-foreground">Select service category</span>

          <ChevronDownIcon :size="16" class="text-muted-foreground/80 shrink-0" aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search services..." />
          <CommandList>
            <CommandEmpty>No service found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                class="flex items-center justify-between"
                @click="onSelect(item.value)"
              >
                <div class="flex items-center gap-2">
                  <component :is="item.icon" class="text-muted-foreground size-4" />
                  {{ item.label }}
                </div>
                <span class="text-muted-foreground text-xs">{{ item.number.toLocaleString() }}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
