<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';
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
  <div class="flex items-center justify-between gap-3"><p class="text-muted-foreground flex-1 text-sm whitespace-nowrap" aria-live="polite">Page <span class="text-foreground">{{ currentPage }}</span>of{{ ' ' }}<span class="text-foreground">{{ totalPages }}</span></p><div class="grow"><Pagination><PaginationContent><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" aria-label="Go to previous page" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ChevronLeftIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem v-if="showLeftEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem v-for="(page, index) in pages" :key="page"><PaginationLink :href="`#/page/${page}`" :isActive="page === currentPage">{{ page }}</PaginationLink></PaginationItem><PaginationItem v-if="showRightEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`" aria-label="Go to next page" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined"><ChevronRightIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem></PaginationContent></Pagination></div><div class="flex flex-1 justify-end"><Select default-value="10" aria-label="Results per page"><SelectTrigger id="results-per-page" class="w-fit whitespace-nowrap"><SelectValue placeholder="Select number of results" /></SelectTrigger><SelectContent><SelectItem value="10">10 / page</SelectItem><SelectItem value="20">20 / page</SelectItem><SelectItem value="50">50 / page</SelectItem><SelectItem value="100">100 / page</SelectItem></SelectContent></Select></div></div>
</template>
