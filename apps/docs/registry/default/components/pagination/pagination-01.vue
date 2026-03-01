<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
</script>
<template>
<Pagination>
      <PaginationContent class="w-full justify-between gap-3">
        <PaginationItem>
          <Button
            variant="outline"
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled=undefined
            role=undefined
            asChild
          >
            <a href="#/page/pagination-01-id">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-ms-1 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              Previous
            </a>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="outline"
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled=undefined
            role=undefined
            asChild
          >
            <a href="#/page/pagination-01-id">
              Next
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-me-1 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            </a>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
</template>
