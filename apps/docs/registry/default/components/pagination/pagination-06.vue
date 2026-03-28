<script setup lang="ts">
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@timui/vue';
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
  <Pagination><PaginationContent><PaginationItem><PaginationPrevious class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined" /></PaginationItem><PaginationItem v-if="showLeftEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem v-for="(page, index) in pages" :key="page"><PaginationLink :href="`#/page/${page}`" :isActive="page === currentPage">{{ page }}</PaginationLink></PaginationItem><PaginationItem v-if="showRightEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem><PaginationNext class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined" /></PaginationItem></PaginationContent></Pagination>
</template>
