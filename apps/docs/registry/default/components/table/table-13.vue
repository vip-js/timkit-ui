<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@timui/core'
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, SearchIcon } from 'lucide-vue-next'
import { Input } from '@timui/vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue'
import { Table } from '@timui/vue'
import { TableBody } from '@timui/vue'
import { TableCell } from '@timui/vue'
import { TableHead } from '@timui/vue'
import { TableHeader } from '@timui/vue'
import { TableRow } from '@timui/vue'

type KeywordRow = {
  id: string
  keyword: string
  intents: Array<'Informational' | 'Navigational' | 'Commercial' | 'Transactional'>
  volume: number
  cpc: number
  traffic: number
  link: string
}

const rows: KeywordRow[] = [
  {
    id: '1',
    keyword: 'react components',
    intents: ['Informational', 'Navigational'],
    volume: 2507,
    cpc: 2.5,
    traffic: 88,
    link: 'https://ui.timkit.cn',
  },
  {
    id: '2',
    keyword: 'buy react templates',
    intents: ['Commercial', 'Transactional'],
    volume: 1850,
    cpc: 4.75,
    traffic: 65,
    link: 'https://ui.timkit.cn/input',
  },
  {
    id: '3',
    keyword: 'react ui library',
    intents: ['Informational', 'Commercial'],
    volume: 3200,
    cpc: 3.25,
    traffic: 112,
    link: 'https://ui.timkit.cn/badge',
  },
  {
    id: '4',
    keyword: 'tailwind components download',
    intents: ['Transactional'],
    volume: 890,
    cpc: 1.95,
    traffic: 45,
    link: 'https://ui.timkit.cn/alert',
  },
  {
    id: '5',
    keyword: 'react dashboard template free',
    intents: ['Commercial', 'Transactional'],
    volume: 4100,
    cpc: 5.5,
    traffic: 156,
    link: 'https://ui.timkit.cn/tabs',
  },
  {
    id: '6',
    keyword: 'how to use react components',
    intents: ['Informational'],
    volume: 1200,
    cpc: 1.25,
    traffic: 42,
    link: 'https://ui.timkit.cn/table',
  },
]

const keywordFilter = ref('')
const intentFilter = ref('all')
const volumeMin = ref<number | null>(null)
const volumeMax = ref<number | null>(null)
const cpcMin = ref<number | null>(null)
const cpcMax = ref<number | null>(null)
const trafficMin = ref<number | null>(null)
const trafficMax = ref<number | null>(null)
const sortBy = ref<'traffic' | 'volume' | 'cpc'>('traffic')
const sortDirection = ref<'asc' | 'desc'>('asc')

function toggleSort(field: 'traffic' | 'volume' | 'cpc') {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortBy.value = field
  sortDirection.value = 'asc'
}

const filteredRows = computed(() => {
  let next = rows.filter((row) => {
    const matchesKeyword =
      keywordFilter.value.trim().length === 0 ||
      row.keyword.toLowerCase().includes(keywordFilter.value.toLowerCase())

    const matchesIntent =
      intentFilter.value === 'all' || row.intents.includes(intentFilter.value as KeywordRow['intents'][number])

    const matchesVolume =
      (volumeMin.value === null || row.volume >= volumeMin.value) &&
      (volumeMax.value === null || row.volume <= volumeMax.value)

    const matchesCpc =
      (cpcMin.value === null || row.cpc >= cpcMin.value) &&
      (cpcMax.value === null || row.cpc <= cpcMax.value)

    const matchesTraffic =
      (trafficMin.value === null || row.traffic >= trafficMin.value) &&
      (trafficMax.value === null || row.traffic <= trafficMax.value)

    return matchesKeyword && matchesIntent && matchesVolume && matchesCpc && matchesTraffic
  })

  next = [...next].sort((left, right) => {
    const diff = left[sortBy.value] - right[sortBy.value]
    return sortDirection.value === 'asc' ? diff : -diff
  })

  return next
})

function intentClass(intent: KeywordRow['intents'][number]) {
  return {
    Informational: 'bg-indigo-400/20 text-indigo-500',
    Navigational: 'bg-emerald-400/20 text-emerald-500',
    Commercial: 'bg-amber-400/20 text-amber-500',
    Transactional: 'bg-rose-400/20 text-rose-500',
  }[intent]
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-3">
      <div class="relative w-52">
        <Input
          class="peer ps-9"
          :value="keywordFilter"
          placeholder="Search keyword..."
          @input="keywordFilter = ($event.target as HTMLInputElement).value"
        />
        <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
          <SearchIcon class="size-4" aria-hidden="true" />
        </div>
      </div>

      <div class="w-44">
        <Select :value="intentFilter" @update:modelValue="(value) => (intentFilter = value)">
          <SelectTrigger><SelectValue placeholder="All intents" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All intents</SelectItem>
            <SelectItem value="Informational">Informational</SelectItem>
            <SelectItem value="Navigational">Navigational</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Transactional">Transactional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Input class="w-28" type="number" placeholder="Vol min" @input="volumeMin = Number(($event.target as HTMLInputElement).value) || null" />
      <Input class="w-28" type="number" placeholder="Vol max" @input="volumeMax = Number(($event.target as HTMLInputElement).value) || null" />
      <Input class="w-28" type="number" placeholder="CPC min" @input="cpcMin = Number(($event.target as HTMLInputElement).value) || null" />
      <Input class="w-28" type="number" placeholder="CPC max" @input="cpcMax = Number(($event.target as HTMLInputElement).value) || null" />
      <Input class="w-28" type="number" placeholder="Trf min" @input="trafficMin = Number(($event.target as HTMLInputElement).value) || null" />
      <Input class="w-28" type="number" placeholder="Trf max" @input="trafficMax = Number(($event.target as HTMLInputElement).value) || null" />
    </div>

    <Table>
      <TableHeader>
        <TableRow class="bg-muted/50">
          <TableHead>Keyword</TableHead>
          <TableHead>Intents</TableHead>
          <TableHead class="cursor-pointer select-none" @click="toggleSort('volume')">
            <span class="flex items-center gap-1">
              Volume
              <ChevronUpIcon v-if="sortBy === 'volume' && sortDirection === 'asc'" :size="14" />
              <ChevronDownIcon v-else-if="sortBy === 'volume'" :size="14" />
            </span>
          </TableHead>
          <TableHead class="cursor-pointer select-none" @click="toggleSort('cpc')">
            <span class="flex items-center gap-1">
              CPC
              <ChevronUpIcon v-if="sortBy === 'cpc' && sortDirection === 'asc'" :size="14" />
              <ChevronDownIcon v-else-if="sortBy === 'cpc'" :size="14" />
            </span>
          </TableHead>
          <TableHead class="cursor-pointer select-none" @click="toggleSort('traffic')">
            <span class="flex items-center gap-1">
              Traffic
              <ChevronUpIcon v-if="sortBy === 'traffic' && sortDirection === 'asc'" :size="14" />
              <ChevronDownIcon v-else-if="sortBy === 'traffic'" :size="14" />
            </span>
          </TableHead>
          <TableHead>Link</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-if="filteredRows.length > 0">
          <TableRow v-for="row in filteredRows" :key="row.id">
            <TableCell class="font-medium">{{ row.keyword }}</TableCell>
            <TableCell>
              <div class="flex gap-1">
                <span
                  v-for="intent in row.intents"
                  :key="intent"
                  :class="cn('flex size-5 items-center justify-center rounded text-xs font-medium', intentClass(intent))"
                >
                  {{ intent.charAt(0) }}
                </span>
              </div>
            </TableCell>
            <TableCell>{{ row.volume.toLocaleString() }}</TableCell>
            <TableCell>${{ row.cpc.toFixed(2) }}</TableCell>
            <TableCell>{{ row.traffic.toLocaleString() }}</TableCell>
            <TableCell>
              <a class="inline-flex items-center gap-1 hover:underline" :href="row.link" target="_blank" rel="noopener noreferrer">
                {{ row.link }}
                <ExternalLinkIcon :size="12" aria-hidden="true" />
              </a>
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow>
            <TableCell :colSpan="6" class="h-24 text-center">No results.</TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <p class="text-muted-foreground mt-4 text-center text-sm">
      Data table with filters made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
