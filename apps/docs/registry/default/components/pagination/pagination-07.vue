<script setup lang="ts">
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@timui/vue';
import { usePagination } from '@/registry/default/hooks/use-pagination';

const currentPage = 1;
const totalPages = 10;
const paginationItemsToDisplay = 5;
const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay,
});
</script>

<template>
  <Pagination><PaginationContent><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" aria-label="Go to first page" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ChevronFirstIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" aria-label="Go to previous page" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ChevronLeftIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem v-if="showLeftEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem v-for="(page, index) in pages" :key="page"><PaginationLink :href="`#/page/${page}`" :isActive="page === currentPage">{{ page }}</PaginationLink></PaginationItem><PaginationItem v-if="showRightEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`" aria-label="Go to next page" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined"><ChevronRightIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === totalPages ? undefined : `#/page/${totalPages}`" aria-label="Go to last page" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined"><ChevronLastIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem></PaginationContent></Pagination>
</template>
