<script setup lang="ts">
import { CheckIcon, MonitorIcon, SmartphoneIcon, XIcon } from 'lucide-vue-next';
import { Table } from '@timui/vue';
import { TableBody } from '@timui/vue';
import { TableCell } from '@timui/vue';
import { TableHead } from '@timui/vue';
import { TableHeader } from '@timui/vue';
import { TableRow } from '@timui/vue';





const items = [
  {
    feature: 'scroll-timeline',
    desktop: [
      { name: 'Chrome', supported: true, version: '115' },
      { name: 'Edge', supported: true, version: '115' },
      { name: 'Firefox', supported: false, version: '111' },
      { name: 'Opera', supported: true, version: '101' },
      { name: 'Safari', supported: false, version: 'No' },
    ],
    mobile: [
      { name: 'Chrome Android', supported: true, version: '115' },
      { name: 'Firefox Android', supported: false, version: 'No' },
      { name: 'Opera Android', supported: true, version: '77' },
      { name: 'Safari iOS', supported: false, version: 'No' },
      { name: 'Samsung Internet', supported: true, version: '23' },
    ],
  },
  {
    feature: 'view-timeline',
    desktop: [
      { name: 'Chrome', supported: true, version: '115' },
      { name: 'Edge', supported: true, version: '115' },
      { name: 'Firefox', supported: false, version: '114' },
      { name: 'Opera', supported: true, version: '101' },
      { name: 'Safari', supported: false, version: 'No' },
    ],
    mobile: [
      { name: 'Chrome Android', supported: true, version: '115' },
      { name: 'Firefox Android', supported: false, version: 'No' },
      { name: 'Opera Android', supported: true, version: '77' },
      { name: 'Safari iOS', supported: false, version: 'No' },
      { name: 'Samsung Internet', supported: true, version: '23' },
    ],
  },
  {
    feature: 'font-size-adjust',
    desktop: [
      { name: 'Chrome', supported: true, version: '127' },
      { name: 'Edge', supported: true, version: '127' },
      { name: 'Firefox', supported: false, version: '3' },
      { name: 'Opera', supported: true, version: '113' },
      { name: 'Safari', supported: true, version: '16.4' },
    ],
    mobile: [
      { name: 'Chrome Android', supported: true, version: '127' },
      { name: 'Firefox Android', supported: true, version: '4' },
      { name: 'Opera Android', supported: true, version: '84' },
      { name: 'Safari iOS', supported: true, version: '16.4' },
      { name: 'Samsung Internet', supported: false, version: 'No' },
    ],
  },
]

</script>

<template>
  <Table><TableHeader><TableRow class="*:border-border border-y-0 hover:bg-transparent [&>:not(:last-child)]:border-r"><TableCell></TableCell><TableHead class="border-b text-center" :colSpan="5"><MonitorIcon class="inline-flex" :size="16" aria-hidden="true" /><span class="sr-only">Desktop browsers</span></TableHead><TableHead class="border-b text-center" :colSpan="5"><SmartphoneIcon class="inline-flex" :size="16" aria-hidden="true" /><span class="sr-only">Mobile browsers</span></TableHead></TableRow></TableHeader><TableHeader><TableRow class="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"><TableCell></TableCell><TableHead v-for="(browser, index) in items[0].desktop" :key="browser.name" class="text-foreground h-auto py-3 align-bottom"><span class="relative left-[calc(50%-.5rem)] block rotate-180 leading-4 whitespace-nowrap [text-orientation:sideways] [writing-mode:vertical-rl]">{{ browser.name }}</span></TableHead><TableHead v-for="(browser, index) in items[0].mobile" :key="browser.name" class="text-foreground h-auto py-3 align-bottom"><span class="relative left-[calc(50%-.5rem)] block rotate-180 leading-4 whitespace-nowrap [text-orientation:sideways] [writing-mode:vertical-rl]">{{ browser.name }}</span></TableHead></TableRow></TableHeader><TableBody><TableRow v-for="(item, index) in items" :key="item.feature" class="*:border-border [&>:not(:last-child)]:border-r"><TableHead class="text-foreground font-medium">{{ item.feature }}</TableHead><TableCell v-for="(browser, index) in [...item.desktop, ...item.mobile]" :key="`${browser.name}-${index}`" class="space-y-1 text-center"><template v-if="browser.supported">
<CheckIcon class="inline-flex stroke-emerald-600" :size="16" aria-hidden="true" />
</template>
<template v-else>
<XIcon class="inline-flex stroke-red-600" :size="16" aria-hidden="true" />
</template><span class="sr-only"><template v-if="browser.supported">
{{ 'Supported' }}
</template>
<template v-else>
{{ 'Not supported' }}
</template></span><div class="text-muted-foreground text-xs font-medium">{{ browser.version }}</div></TableCell></TableRow></TableBody></Table>
</template>
