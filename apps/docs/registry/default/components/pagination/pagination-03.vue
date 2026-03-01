<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
</script>
<template>
  <Pagination>
    <PaginationContent class="w-full justify-between">
      <PaginationItem>
        <PaginationLink href="#/page/pagination-03-prev" aria-label="Go to previous page">
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
      <PaginationItem>
        <p class="text-muted-foreground text-sm" aria-live="polite">
          Page <span class="text-foreground">2</span> of
          <span class="text-foreground">10</span>
        </p>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#/page/pagination-03-next" aria-label="Go to next page">
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
