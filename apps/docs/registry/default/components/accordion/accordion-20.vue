<script setup lang="ts">
import { AtSignIcon, ChevronDownIcon, CircleDashedIcon, CommandIcon, EclipseIcon, GaugeIcon, LucideIcon, ZapIcon } from 'lucide-vue-next';
import { Accordion } from '@/components/ui/accordion';
import { AccordionContent } from '@/components/ui/accordion-content';
import { AccordionItem } from '@/components/ui/accordion-item';
import { AccordionTrigger } from '@/components/ui/accordion-trigger';
import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleContent } from '@/components/ui/collapsible-content';
import { CollapsibleTrigger } from '@/components/ui/collapsible-trigger';



</script>

<template>
  <div class="space-y-4"><h2 class="text-xl font-bold">Multi-level w/ icon</h2><Accordion type="single" collapsible class="w-full" default-value="3"><AccordionItem v-for="(item, index) in items" :key="index" :value="item.id" :key="item.id" class="has-focus-visible:border-ring has-focus-visible:ring-ring/50 outline-none has-focus-visible:ring-[3px]"><AccordionTrigger class="justify-start gap-3 rounded-md text-[15px] leading-6 outline-none hover:no-underline focus-visible:ring-0 [&>svg]:-order-1"><span class="flex items-center gap-3"><item.icon :size="16" class="shrink-0 opacity-60" aria-hidden="true" /><span>{{ item.title }}</span></span></AccordionTrigger><AccordionContent class="p-0"><CollapsibleDemo v-for="(collapsible, index) in item.collapsibles" :key="index" :key="index" :title="collapsible.title" :content="collapsible.content" :open="collapsible.open" :icon="collapsible.icon" /></AccordionContent></AccordionItem></Accordion></div>
</template>
