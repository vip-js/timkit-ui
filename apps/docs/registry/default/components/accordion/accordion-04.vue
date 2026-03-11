<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next';
import { Accordion } from '@/components/ui/accordion';
import { AccordionContent } from '@/components/ui/accordion-content';
import { AccordionItem } from '@/components/ui/accordion-item';
import { AccordionTrigger } from '@/components/ui/accordion-trigger';



</script>

<template>
  <div class="space-y-4"><h2 class="text-xl font-bold">W/ left plus-minus</h2><Accordion type="single" collapsible class="w-full" default-value="3"><AccordionItem v-for="(item, index) in items" :key="index" :value="item.id" :key="item.id" class="py-2"><div class="flex"><AccordionTrigger :showChevron="false" class="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg]:-order-1 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">{{ item.title }}<PlusIcon :size="16" class="pointer-events-none shrink-0 opacity-60 transition-transform duration-200" aria-hidden="true" /></AccordionTrigger></div><AccordionContent class="text-muted-foreground ps-7 pb-2">{{ item.content }}</AccordionContent></AccordionItem></Accordion></div>
</template>
