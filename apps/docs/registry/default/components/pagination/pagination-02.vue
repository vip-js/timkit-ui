<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
</script>
<template>
<Pagination>
      <PaginationContent class="w-full justify-between gap-3">
        <PaginationItem>
          <Button
            variant="ghost"
            class="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled=undefined
            role=undefined
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"><circle cx="12" cy="12" r="9" /></svg>
            Previous
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="ghost"
            class="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled=undefined
            role=undefined
          >
            Next
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
</template>
