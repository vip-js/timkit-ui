<script setup lang="ts">
import { Accordion } from '@/components/ui/accordion';
import { AccordionContent } from '@/components/ui/accordion-content';
import { AccordionItem } from '@/components/ui/accordion-item';
import { AccordionTrigger } from '@/components/ui/accordion-trigger';



</script>

<template>
  <div class="space-y-4"><h2 class="text-xl font-bold">Tabs w/ chevron</h2><Accordion type="single" collapsible class="w-full space-y-2" default-value="3"><AccordionItem v-for="(item, index) in items" :key="index" :value="item.id" :key="item.id" class="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 rounded-md border px-4 py-1 outline-none last:border-b has-focus-visible:ring-[3px]"><AccordionTrigger class="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">{{ item.title }}</AccordionTrigger><AccordionContent class="text-muted-foreground pb-2">{{ item.content }}</AccordionContent></AccordionItem></Accordion></div>
</template>
