<script setup lang="ts">
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';




</script>

<template>
  <Pagination><PaginationContent><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" aria-label="Go to first page" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ChevronFirstIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" aria-label="Go to previous page" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ChevronLeftIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem><Select :default-value="String(currentPage)" aria-label="Select page"><SelectTrigger id="select-page" class="w-fit whitespace-nowrap"><SelectValue placeholder="Select page" /></SelectTrigger><SelectContent><SelectItem v-for="(page, index) in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="page" :value="String(page)">Page {{ page }}</SelectItem></SelectContent></Select></PaginationItem><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`" aria-label="Go to next page" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined"><ChevronRightIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === totalPages ? undefined : `#/page/${totalPages}`" aria-label="Go to last page" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined"><ChevronLastIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem></PaginationContent></Pagination>
</template>
