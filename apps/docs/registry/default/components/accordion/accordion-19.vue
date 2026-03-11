<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next';
import { Accordion } from '@/components/ui/accordion';
import { AccordionContent } from '@/components/ui/accordion-content';
import { AccordionItem } from '@/components/ui/accordion-item';
import { AccordionTrigger } from '@/components/ui/accordion-trigger';
import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleContent } from '@/components/ui/collapsible-content';
import { CollapsibleTrigger } from '@/components/ui/collapsible-trigger';



</script>

<template>
  <div class="space-y-4"><h2 class="text-xl font-bold">Multi-level</h2><Accordion type="single" collapsible class="w-full -space-y-px" default-value="3"><AccordionItem v-for="(item, index) in items" :key="index" :value="item.id" :key="item.id" class="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative border outline-none first:rounded-t-md last:rounded-b-md last:border-b has-focus-visible:z-10 has-focus-visible:ring-[3px]"><AccordionTrigger class="rounded-md px-4 py-3 text-[15px] leading-6 outline-none hover:no-underline focus-visible:ring-0">{{ item.title }}</AccordionTrigger><AccordionContent class="p-0"><CollapsibleDemo v-for="(collapsible, index) in item.collapsibles" :key="index" :key="index" :title="collapsible.title" :content="collapsible.content" :open="collapsible.open" /></AccordionContent></AccordionItem></Accordion></div>
</template>
