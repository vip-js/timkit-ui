<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
</script>
<template>
<Pagination>
      <PaginationContent>
        
        <PaginationItem>
          <PaginationPrevious
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-06-id"
            aria-disabled=undefined
            role=undefined
          />
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
          <PaginationNext
            class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#/page/pagination-06-id"
            aria-disabled=undefined
            role=undefined
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
</template>
