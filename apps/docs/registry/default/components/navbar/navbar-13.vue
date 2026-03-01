<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BreadcrumbList } from '@/components/ui/breadcrumb-list'
import { BreadcrumbItem } from '@/components/ui/breadcrumb-item'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronsUpDown } from '@/components/ui/chevrons-up-down'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb-separator'
</script>
<template>
<header class="border-b px-4 md:px-6">
      <div class="flex h-16 items-center justify-between gap-4">
        
        <div class="flex items-center gap-2">
          
          <Popover>
            <PopoverTrigger asChild>
              <Button class="group size-8 md:hidden" variant="ghost" size="icon">
                <svg
                  class="pointer-events-none" width="16" height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    class="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    class="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    class="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" class="w-36 p-1 md:hidden">
              <NavigationMenu class="max-w-none *:w-full">
                <NavigationMenuList class="flex-col items-start gap-0 md:gap-2">
                  
                    <NavigationMenuItem class="w-full">
                      <NavigationMenuLink class="py-1.5">
                        
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  

                    <NavigationMenuItem class="w-full">
                      <NavigationMenuLink class="py-1.5">
                        
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  

                    <NavigationMenuItem class="w-full">
                      <NavigationMenuLink class="py-1.5">
                        
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Select defaultValue="personal">
                  <SelectTrigger aria-label="Select account type" asChild>
                    <Button
                      variant="ghost"
                      class="focus-visible:bg-accent text-foreground h-8 p-1.5 focus-visible:ring-0"
                    >
                      <SelectValue placeholder="Select account type" />
                      <ChevronsUpDown size="14" class="text-muted-foreground/80" />
                    </Button>
                  </SelectTrigger>
                  <SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
              <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Select defaultValue="1">
                  <SelectTrigger aria-label="Select project" asChild>
                    <Button
                      variant="ghost"
                      class="focus-visible:bg-accent text-foreground h-8 p-1.5 focus-visible:ring-0"
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
          <div class="flex items-center gap-2">
            
            <NavigationMenu class="max-md:hidden">
              <NavigationMenuList class="gap-2">
                
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                
              </NavigationMenuList>
            </NavigationMenu>
            
            <SettingsMenu />
          </div>
          
          <UserMenu />
        </div>
      </div>
    </header>
</template>
