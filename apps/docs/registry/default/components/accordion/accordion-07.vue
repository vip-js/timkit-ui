<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next';
import { Accordion } from '@/components/ui/accordion';
import { AccordionContent } from '@/components/ui/accordion-content';
import { AccordionItem } from '@/components/ui/accordion-item';
import { AccordionTrigger } from '@/components/ui/accordion-trigger';



</script>

<template>
  <div class="space-y-4"><h2 class="text-xl font-bold">W/ sub-header and chevron</h2><Accordion type="single" collapsible class="w-full" default-value="3"><AccordionItem v-for="(item, index) in items" :key="index" :value="item.id" :key="item.id" class="py-2"><div class="flex"><AccordionTrigger :showChevron="false" class="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180"><span class="flex flex-col space-y-1"><span>{{ item.title }}</span><span v-if="item.sub" class="text-sm font-normal">{{ item.sub }}</span></span><ChevronDownIcon :size="16" class="pointer-events-none shrink-0 opacity-60 transition-transform duration-200" aria-hidden="true" /></AccordionTrigger></div><AccordionContent class="text-muted-foreground pb-2">{{ item.content }}</AccordionContent></AccordionItem></Accordion></div>
</template>
