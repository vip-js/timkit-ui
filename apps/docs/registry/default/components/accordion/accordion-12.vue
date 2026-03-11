<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next';
import { Accordion } from '@/components/ui/accordion';
import { AccordionContent } from '@/components/ui/accordion-content';
import { AccordionItem } from '@/components/ui/accordion-item';
import { AccordionTrigger } from '@/components/ui/accordion-trigger';



</script>

<template>
  <div class="space-y-4"><h2 class="text-xl font-bold">Tabs w/ plus-minus</h2><Accordion type="single" collapsible class="w-full space-y-2" default-value="3"><AccordionItem v-for="(item, index) in items" :key="index" :value="item.id" :key="item.id" class="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 rounded-md border px-4 py-1 outline-none last:border-b has-focus-visible:ring-[3px]"><div class="flex"><AccordionTrigger :showChevron="false" class="ocus-visible:ring-0 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">{{ item.title }}<PlusIcon :size="16" class="pointer-events-none shrink-0 opacity-60 transition-transform duration-200" aria-hidden="true" /></AccordionTrigger></div><AccordionContent class="text-muted-foreground pb-2">{{ item.content }}</AccordionContent></AccordionItem></Accordion></div>
</template>
