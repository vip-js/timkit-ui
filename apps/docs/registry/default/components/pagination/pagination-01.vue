<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Pagination, PaginationContent, PaginationItem } from '@timui/vue';





const demoClicks = ref(0)
const currentPage = ref(1)
const totalPages = ref(5)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Pagination><PaginationContent class="w-full justify-between gap-3"><PaginationItem><Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline" class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined" as-child><a :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`"><ChevronLeftIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Previous
            </a></Button></PaginationItem><PaginationItem><Button variant="outline" class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined" as-child><a :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`">Next
              <ChevronRightIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></a></Button></PaginationItem></PaginationContent></Pagination>
</template>
