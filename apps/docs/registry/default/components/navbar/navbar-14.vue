<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
</script>
<template>
<header class="border-b px-4 md:px-6">
      <div class="flex h-16 items-center justify-between gap-4">
        
        <div class="flex flex-1 items-center gap-2">
          
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
            <PopoverContent align="start" class="w-48 p-1 md:hidden">
              <NavigationMenu class="max-w-none *:w-full">
                <NavigationMenuList class="flex-col items-start gap-0 md:gap-2">
                  
                      <NavigationMenuItem class="w-full">
                        <NavigationMenuLink
                          class="flex-row items-center gap-2 py-1.5"
                        >
                           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="9" /></svg>
                          <span></span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    

                      <NavigationMenuItem class="w-full">
                        <NavigationMenuLink
                          class="flex-row items-center gap-2 py-1.5"
                        >
                           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="9" /></svg>
                          <span></span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    

                      <NavigationMenuItem class="w-full">
                        <NavigationMenuLink
                          class="flex-row items-center gap-2 py-1.5"
                        >
                           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="9" /></svg>
                          <span></span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    

                      <NavigationMenuItem class="w-full">
                        <NavigationMenuLink
                          class="flex-row items-center gap-2 py-1.5"
                        >
                           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="9" /></svg>
                          <span></span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <TeamSwitcher />
        </div>
        
        <NavigationMenu class="max-md:hidden">
          <NavigationMenuList class="gap-2">
            
                <NavigationMenuItem>
                  <NavigationMenuLink
                    class="flex size-8 items-center justify-center p-1.5"
                  >
                     <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                    <span class="sr-only"></span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              

                <NavigationMenuItem>
                  <NavigationMenuLink
                    class="flex size-8 items-center justify-center p-1.5"
                  >
                     <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                    <span class="sr-only"></span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              

                <NavigationMenuItem>
                  <NavigationMenuLink
                    class="flex size-8 items-center justify-center p-1.5"
                  >
                     <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                    <span class="sr-only"></span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              

                <NavigationMenuItem>
                  <NavigationMenuLink
                    class="flex size-8 items-center justify-center p-1.5"
                  >
                     <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                    <span class="sr-only"></span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              
          </NavigationMenuList>
        </NavigationMenu>
        
        <div class="flex flex-1 items-center justify-end gap-4">
          <Button size="sm" class="aspect-square text-sm max-sm:p-0">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 sm:-ms-1"><circle cx="12" cy="12" r="9" /></svg>
            <span class="max-sm:sr-only">Post</span>
          </Button>
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>
    </header>
</template>
