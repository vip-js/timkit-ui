<script setup lang="ts">
import { CheckIcon, MonitorIcon, SmartphoneIcon, XIcon } from 'lucide-vue-next';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';



</script>

<template>
  <Table><TableHeader><TableRow class="*:border-border border-y-0 hover:bg-transparent [&>:not(:last-child)]:border-r"><TableCell></TableCell><TableHead class="border-b text-center" :colSpan="5"><MonitorIcon class="inline-flex" :size="16" aria-hidden="true" /><span class="sr-only">Desktop browsers</span></TableHead><TableHead class="border-b text-center" :colSpan="5"><SmartphoneIcon class="inline-flex" :size="16" aria-hidden="true" /><span class="sr-only">Mobile browsers</span></TableHead></TableRow></TableHeader><TableHeader><TableRow class="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"><TableCell></TableCell><TableHead v-for="(browser, index) in items[0].desktop" :key="index" :key="browser.name" class="text-foreground h-auto py-3 align-bottom"><span class="relative left-[calc(50%-.5rem)] block rotate-180 leading-4 whitespace-nowrap [text-orientation:sideways] [writing-mode:vertical-rl]">{{ browser.name }}</span></TableHead><TableHead v-for="(browser, index) in items[0].mobile" :key="index" :key="browser.name" class="text-foreground h-auto py-3 align-bottom"><span class="relative left-[calc(50%-.5rem)] block rotate-180 leading-4 whitespace-nowrap [text-orientation:sideways] [writing-mode:vertical-rl]">{{ browser.name }}</span></TableHead></TableRow></TableHeader><TableBody><TableRow v-for="(item, index) in items" :key="index" :key="item.feature" class="*:border-border [&>:not(:last-child)]:border-r"><TableHead class="text-foreground font-medium">{{ item.feature }}</TableHead><TableCell v-for="(browser, index) in [...item.desktop, ...item.mobile]" :key="index" :key="`${browser.name}-${index}`" class="space-y-1 text-center">{{ browser.supported ? (
                  <CheckIcon
                    className="inline-flex stroke-emerald-600"
                    size={16}
                    aria-hidden="true"
                  />
                ) : (
                  <XIcon className="inline-flex stroke-red-600" size={16} aria-hidden="true" />
                ) }}<span class="sr-only">{{ browser.supported ? 'Supported' : 'Not supported' }}</span><div class="text-muted-foreground text-xs font-medium">{{ browser.version }}</div></TableCell></TableRow></TableBody></Table>
</template>
