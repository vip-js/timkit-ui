<script setup lang="ts">
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BreadcrumbList } from '@/components/ui/breadcrumb-list'
import { BreadcrumbItem } from '@/components/ui/breadcrumb-item'
import { BreadcrumbLink } from '@/components/ui/breadcrumb-link'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb-separator'
import { BreadcrumbPage } from '@/components/ui/breadcrumb-page'
import { Button } from '@/components/ui/button'
</script>
<template>
<header class="border-b px-4 md:px-6">
      <div class="flex h-16 items-center justify-between gap-4">
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                <span class="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div class="flex items-center gap-2">
          
          <DatePicker />
          
          <Filters />
          
          <Button size="sm" variant="outline" class="aspect-square text-sm max-sm:p-0">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/80 sm:-ms-1"><circle cx="12" cy="12" r="9" /></svg>
            <span class="max-sm:sr-only">Saved</span>
          </Button>
        </div>
      </div>
    </header>
</template>
