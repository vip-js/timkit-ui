<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@timui/vue';
import { usePagination } from '@/registry/default/hooks/use-pagination';

const id = 'pagination-12';
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
  <div class="flex items-center justify-between gap-4"><div><Pagination><PaginationContent><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" aria-label="Go to previous page" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ChevronLeftIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem v-if="showLeftEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem v-for="(page, index) in pages" :key="page"><PaginationLink :href="`#/page/${page}`" :isActive="page === currentPage">{{ page }}</PaginationLink></PaginationItem><PaginationItem v-if="showRightEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem><PaginationLink class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`" aria-label="Go to next page" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined"><ChevronRightIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem></PaginationContent></Pagination></div><div class="flex items-center gap-3"><Label :htmlFor="id" class="whitespace-nowrap">Go to page
        </Label><Input :id="id" type="text" class="w-14" :default-value="String(currentPage)" /></div></div>
</template>
