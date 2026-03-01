<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<Pagination>
      <PaginationContent>
        
        <PaginationItem>
          <PaginationLink
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-11-id"
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
            href="#/page/pagination-11-id"
            aria-label="Go to previous page"
            aria-disabled=undefined
            role=undefined
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </PaginationLink>
        </PaginationItem>

        
        <PaginationItem>
          <Select aria-label="Select page">
            <SelectTrigger id="select-page" class="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              
                <SelectItem>
                  Page 1
                </SelectItem>
              

                <SelectItem>
                  Page 2
                </SelectItem>
              

                <SelectItem>
                  Page 3
                </SelectItem>
              

                <SelectItem>
                  Page 4
                </SelectItem>
              

                <SelectItem>
                  Page 5
                </SelectItem>
              
            </SelectContent>
          </Select>
        </PaginationItem>

        
        <PaginationItem>
          <PaginationLink
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-11-id"
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
            href="#/page/pagination-11-id"
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
