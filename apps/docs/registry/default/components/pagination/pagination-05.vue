<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';



</script>

<template>
  <div class="flex items-center justify-between gap-3"><p class="text-muted-foreground grow text-sm" aria-live="polite">Page <span class="text-foreground">{{ currentPage }}</span>of{{ ' ' }}<span class="text-foreground">{{ totalPages }}</span></p><Pagination class="w-auto"><PaginationContent class="gap-3"><PaginationItem><Button variant="outline" class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :aria-disabled="currentPage === 1 ? true : undefined" :role="currentPage === 1 ? 'link' : undefined" as-child><a :href="currentPage === 1 ? undefined : `#/page/${currentPage - 1}`">Previous</a></Button></PaginationItem><PaginationItem><Button variant="outline" class="aria-disabled:pointer-events-none aria-disabled:opacity-50" :aria-disabled="currentPage === totalPages ? true : undefined" :role="currentPage === totalPages ? 'link' : undefined" as-child><a :href="currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`">Next
              </a></Button></PaginationItem></PaginationContent></Pagination></div>
</template>
