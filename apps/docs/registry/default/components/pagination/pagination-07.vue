<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
</script>
<template>
<Pagination>
      <PaginationContent>
        
        <PaginationItem>
          <PaginationLink
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-07-id"
            aria-label="Go to first page"
            aria-disabled=undefined
            role=undefined
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </PaginationLink>
        </PaginationItem>

        
        <PaginationItem>
          <PaginationLink
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-07-id"
            aria-label="Go to previous page"
            aria-disabled=undefined
            role=undefined
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </PaginationLink>
        </PaginationItem>

        
        

        
        
          <PaginationItem>
            <PaginationLink href="#/page/1">
              1
            </PaginationLink>
          </PaginationItem>
        

          <PaginationItem>
            <PaginationLink href="#/page/2">
              2
            </PaginationLink>
          </PaginationItem>
        

          <PaginationItem>
            <PaginationLink href="#/page/3">
              3
            </PaginationLink>
          </PaginationItem>
        

          <PaginationItem>
            <PaginationLink href="#/page/4">
              4
            </PaginationLink>
          </PaginationItem>
        

          <PaginationItem>
            <PaginationLink href="#/page/5">
              5
            </PaginationLink>
          </PaginationItem>
        

        
        

        
        <PaginationItem>
          <PaginationLink
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-07-id"
            aria-label="Go to next page"
            aria-disabled=undefined
            role=undefined
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </PaginationLink>
        </PaginationItem>

        
        <PaginationItem>
          <PaginationLink
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-07-id"
            aria-label="Go to last page"
            aria-disabled=undefined
            role=undefined
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
</template>
