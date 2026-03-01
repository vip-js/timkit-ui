<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="flex items-center justify-between gap-3">
      
      <p class="text-muted-foreground flex-1 text-sm whitespace-nowrap" aria-live="polite">
        Page <span class="text-foreground"></span> of 
        <span class="text-foreground"></span>
      </p>

      
      <div class="grow">
        <Pagination>
          <PaginationContent>
            
            <PaginationItem>
              <PaginationLink
                class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                href="#/page/pagination-09-id"
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
                href="#/page/pagination-09-id"
                aria-label="Go to next page"
                aria-disabled=undefined
                role=undefined
              >
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      
      <div class="flex flex-1 justify-end">
        <Select defaultValue="10" aria-label="Results per page">
          <SelectTrigger id="results-per-page" class="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
</template>
