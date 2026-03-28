<script setup lang="ts">
import { ListFilterIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue';





const id = 'popover-01';

</script>

<template>
  <div class="flex flex-col gap-4"><Popover><PopoverTrigger as-child><Button variant="outline" size="icon" aria-label="Filters"><ListFilterIcon :size="16" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="w-36 p-3"><div class="space-y-3"><div class="text-muted-foreground text-xs font-medium">Filters</div><form><div class="space-y-3"><div class="flex items-center gap-2"><Checkbox :id="`${id}-1`" /><Label :htmlFor="`${id}-1`" class="font-normal">Real Time
                  </Label></div><div class="flex items-center gap-2"><Checkbox :id="`${id}-2`" /><Label :htmlFor="`${id}-2`" class="font-normal">Top Channels
                  </Label></div><div class="flex items-center gap-2"><Checkbox :id="`${id}-3`" /><Label :htmlFor="`${id}-3`" class="font-normal">Last Orders
                  </Label></div><div class="flex items-center gap-2"><Checkbox :id="`${id}-4`" /><Label :htmlFor="`${id}-4`" class="font-normal">Total Spent
                  </Label></div></div><div role="separator" aria-orientation="horizontal" class="bg-border -mx-3 my-3 h-px"></div><div class="flex justify-between gap-2"><Button size="sm" variant="outline" class="h-7 px-2">Clear
                </Button><Button size="sm" class="h-7 px-2">Apply
                </Button></div></form></div></PopoverContent></Popover></div>
</template>
