<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
</script>
<template>
<div class="flex items-center justify-between gap-8">
      
      <div class="flex items-center gap-3">
        <Label for="pagination-10-id">Rows per page</Label>
        <Select defaultValue="25">
          <SelectTrigger id="pagination-10-id" class="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      
      <div class="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
        <p class="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
          <span class="text-foreground">1-25</span> of 
          <span class="text-foreground">100</span>
        </p>
      </div>

      
      <div>
        <Pagination>
          <PaginationContent>
            
            <PaginationItem>
              <PaginationLink
                class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                href="#/page/pagination-10-id"
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
                href="#/page/pagination-10-id"
                aria-label="Go to previous page"
                aria-disabled=undefined
                role=undefined
              >
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </PaginationLink>
            </PaginationItem>

            
            <PaginationItem>
              <PaginationLink
                class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                href="#/page/pagination-10-id"
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
                href="#/page/pagination-10-id"
                aria-label="Go to last page"
                aria-disabled=undefined
                role=undefined
              >
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
</template>
