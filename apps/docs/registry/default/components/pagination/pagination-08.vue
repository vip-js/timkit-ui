<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'

const currentPage = 3
const pages = [1, 2, 3, 4, 5]
</script>
<template>
  <Pagination>
    <PaginationContent class="inline-flex gap-0 -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
      <PaginationItem class="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
        <PaginationLink
          href="#/page/pagination-08-prev"
          aria-label="Go to previous page"
          class="rounded-none shadow-none focus-visible:z-10"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4 opacity-60"
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
        </PaginationLink>
      </PaginationItem>

      <PaginationItem v-for="page in pages" :key="page">
        <PaginationLink
          :href="`#/page/${page}`"
          :class="[
            'rounded-none shadow-none focus-visible:z-10',
            page === currentPage ? 'bg-accent' : ''
          ]"
        >
          {{ page }}
        </PaginationLink>
      </PaginationItem>

      <PaginationItem class="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
        <PaginationLink
          href="#/page/pagination-08-next"
          aria-label="Go to next page"
          class="rounded-none shadow-none focus-visible:z-10"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4 opacity-60"
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
        </PaginationLink>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</template>
