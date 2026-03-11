<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { usePagination } from '@/registry/default/hooks/use-pagination.vue';


</script>

<template>
  <Pagination><PaginationContent class="inline-flex gap-0 -space-x-px rounded-md shadow-xs rtl:space-x-reverse"><PaginationItem class="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md"><PaginationLink :class="cn(
              buttonVariants({
                variant: 'outline',
              }),
              'rounded-none shadow-none focus-visible:z-10 aria-disabled:pointer-events-none [&[aria-disabled]>svg]:opacity-50'
            )" :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`" aria-label="Go to previous page" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined"><ChevronLeftIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem><PaginationItem v-if="showLeftEllipsis" class="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md"><PaginationEllipsis /></PaginationItem><PaginationItem v-for="(page, index) in pages" :key="index" :key="page"><PaginationLink :class="cn(
                buttonVariants({
                  variant: 'outline',
                }),
                'rounded-none shadow-none focus-visible:z-10',
                page === currentPage && 'bg-accent'
              )" :href="`#/page/${page}`" :isActive="page === currentPage">{{ page }}</PaginationLink></PaginationItem><PaginationItem v-if="showRightEllipsis" class="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md"><PaginationEllipsis :class="cn(
                buttonVariants({
                  variant: 'outline',
                }),
                'pointer-events-none rounded-none shadow-none'
              )" /></PaginationItem><PaginationItem class="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md"><PaginationLink :class="cn(
              buttonVariants({
                variant: 'outline',
              }),
              'rounded-none shadow-none focus-visible:z-10 aria-disabled:pointer-events-none [&[aria-disabled]>svg]:opacity-50'
            )" :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`" aria-label="Go to next page" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined"><ChevronRightIcon :size="16" aria-hidden="true" /></PaginationLink></PaginationItem></PaginationContent></Pagination>
</template>
