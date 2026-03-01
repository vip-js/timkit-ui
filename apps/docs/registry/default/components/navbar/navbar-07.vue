<script setup lang="ts">
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BreadcrumbList } from '@/components/ui/breadcrumb-list'
import { BreadcrumbItem } from '@/components/ui/breadcrumb-item'
import { BreadcrumbLink } from '@/components/ui/breadcrumb-link'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb-separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { BreadcrumbEllipsis } from '@/components/ui/breadcrumb-ellipsis'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown } from '@/components/ui/chevrons-up-down'
</script>
<template>
<header class="border-b px-4 md:px-6">
      <div class="flex h-16 items-center justify-between gap-4">
        
        <div class="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" class="text-foreground">
                  <Logo />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem class="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger class="hover:text-foreground">
                    <BreadcrumbEllipsis />
                    <span class="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <a href="#">Personal Account</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="#">Projects</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbItem class="max-md:hidden">
                <BreadcrumbLink href="#">Personal Account</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="max-md:hidden"> / </BreadcrumbSeparator>
              <BreadcrumbItem class="max-md:hidden">
                <BreadcrumbLink href="#">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Select defaultValue="1">
                  <SelectTrigger aria-label="Select project" asChild>
                    <Button
                      variant="ghost"
                      class="focus-visible:bg-accent text-foreground h-8 px-1.5 focus-visible:ring-0"
                    >
                      <SelectValue placeholder="Select project" />
                      <ChevronsUpDown size="14" class="text-muted-foreground/80" />
                    </Button>
                  </SelectTrigger>
                  <SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                    <SelectItem value="1">Main project</SelectItem>
                    <SelectItem value="2">Origin project</SelectItem>
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div class="flex items-center gap-4">
          
          <NotificationMenu />
          
          <UserMenu />
        </div>
      </div>
    </header>
</template>
