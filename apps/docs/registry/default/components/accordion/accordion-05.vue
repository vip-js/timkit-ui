<script setup lang="ts">
import { AtSignIcon, CommandIcon, EclipseIcon, ZapIcon } from 'lucide-vue-next';
import { Accordion } from '@/components/ui/accordion';
import { AccordionContent } from '@/components/ui/accordion-content';
import { AccordionItem } from '@/components/ui/accordion-item';
import { AccordionTrigger } from '@/components/ui/accordion-trigger';



</script>

<template>
  <div class="space-y-4"><h2 class="text-xl font-bold">W/ icon and chevron</h2><Accordion type="single" collapsible class="w-full" default-value="3"><AccordionItem v-for="(item, index) in items" :key="index" :value="item.id" :key="item.id" class="py-2"><AccordionTrigger class="py-2 text-[15px] leading-6 hover:no-underline"><span class="flex items-center gap-3"><item.icon :size="16" class="shrink-0 opacity-60" aria-hidden="true" /><span>{{ item.title }}</span></span></AccordionTrigger><AccordionContent class="text-muted-foreground ps-7 pb-2">{{ item.content }}</AccordionContent></AccordionItem></Accordion></div>
</template>
