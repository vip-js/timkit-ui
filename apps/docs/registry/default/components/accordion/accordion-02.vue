<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next'
import { Accordion } from '@timui/vue'
import { AccordionContent } from '@timui/vue'
import { AccordionItem } from '@timui/vue'
import { AccordionTrigger } from '@timui/vue'

const items = [
  {
    id: '1',
    title: 'What makes Timkit UI different?',
    content:
      'Timkit UI focuses on developer experience and performance. Built with TypeScript, it offers excellent type safety, follows accessibility standards, and provides comprehensive documentation with regular updates.',
  },
  {
    id: '2',
    title: 'How can I customize the components?',
    content:
      'Use our CSS variables for global styling, or className and style props for component-specific changes. We support CSS modules, Tailwind, and dark mode out of the box.',
  },
  {
    id: '3',
    title: 'Is Timkit UI optimized for performance?',
    content:
      'Yes, with tree-shaking, code splitting, and minimal runtime overhead. Most components are under 5KB gzipped.',
  },
  {
    id: '4',
    title: 'How accessible are the components?',
    content:
      'All components follow WAI-ARIA standards, featuring proper ARIA attributes, keyboard navigation, and screen reader support. Regular testing ensures compatibility with NVDA, VoiceOver, and JAWS.',
  },
]
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">W/ plus-minus</h2>
    <Accordion type="single" collapsible class="w-full" default-value="3">
      <AccordionItem v-for="item in items" :key="item.id" :value="item.id" class="py-2">
        <AccordionTrigger
          class="py-2 text-[15px] leading-6 hover:no-underline [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0"
        >
          <template #icon>
            <PlusIcon
              :size="16"
              class="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
              aria-hidden="true"
            />
          </template>
          {{ item.title }}
        </AccordionTrigger>
        <AccordionContent class="text-muted-foreground pb-2">
          {{ item.content }}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
