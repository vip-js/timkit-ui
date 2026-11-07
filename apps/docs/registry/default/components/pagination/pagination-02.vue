<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Pagination, PaginationContent, PaginationItem } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Pagination><PaginationContent class="w-full justify-between gap-3"><PaginationItem><Button @click="onDemoClick" :data-clicks="demoClicks" variant="ghost" class="group aria-disabled:pointer-events-none aria-disabled:opacity-50" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ArrowLeftIcon class="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5" :size="16" aria-hidden="true" />Previous
          </Button></PaginationItem><PaginationItem><Button variant="ghost" class="group aria-disabled:pointer-events-none aria-disabled:opacity-50" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined">Next
            <ArrowRightIcon class="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5" :size="16" aria-hidden="true" /></Button></PaginationItem></PaginationContent></Pagination>
</template>
