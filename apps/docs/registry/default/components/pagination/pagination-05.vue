<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
</script>
<template>
<div class="flex items-center justify-between gap-3">
      <p class="text-muted-foreground grow text-sm" aria-live="polite">
        Page <span class="text-foreground"></span> of 
        <span class="text-foreground"></span>
      </p>
      <Pagination class="w-auto">
        <PaginationContent class="gap-3">
          <PaginationItem>
            <Button
              variant="outline"
              class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled=undefined
              role=undefined
              asChild
            >
              <a href="#/page/pagination-05-id">Previous</a>
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
              <a href="#/page/pagination-05-id">
                Next
              </a>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
</template>
