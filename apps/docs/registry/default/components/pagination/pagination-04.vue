<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
</script>
<template>
<Pagination>
      <PaginationContent class="gap-3">
        <PaginationItem>
          <PaginationLink
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-04-id"
            aria-label="Go to previous page"
            aria-disabled=undefined
            role=undefined
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <p class="text-muted-foreground text-sm" aria-live="polite">
            Page <span class="text-foreground"></span> of 
            <span class="text-foreground"></span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-04-id"
            aria-label="Go to next page"
            aria-disabled=undefined
            role=undefined
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
</template>
