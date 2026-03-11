<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';



</script>

<template>
  <Pagination><PaginationContent class="w-full justify-between"><PaginationItem><PaginationLink :class="cn(
              'aria-disabled:pointer-events-none aria-disabled:opacity-50',
              buttonVariants({
                variant: 'outline',
              })
            )" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" aria-label="Go to previous page" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ChevronLeftIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem><p class="text-muted-foreground text-sm" aria-live="polite">Page <span class="text-foreground">{{ currentPage }}</span>of{{ ' ' }}<span class="text-foreground">{{ totalPages }}</span></p></PaginationItem><PaginationItem><PaginationLink :class="cn(
              'aria-disabled:pointer-events-none aria-disabled:opacity-50',
              buttonVariants({
                variant: 'outline',
              })
            )" :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`" aria-label="Go to next page" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined"><ChevronRightIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem></PaginationContent></Pagination>
</template>
