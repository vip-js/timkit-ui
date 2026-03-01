<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Input } from '@/components/ui/input'
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
                    
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div class="flex items-center gap-6">
            <a href="#" class="text-primary hover:text-primary/90">
              <Logo />
            </a>
            
            <div class="relative">
              <Input id="navbar-09-id" class="peer h-8 ps-8 pe-2" placeholder="Search..." type="search" />
              <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </div>
            </div>
          </div>
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
              
          </NavigationMenuList>
        </NavigationMenu>
        
        <div class="flex flex-1 items-center justify-end gap-4">
          <div class="flex items-center gap-2">
            
            <Button
              size="icon"
              variant="ghost"
              class="text-muted-foreground relative size-8 rounded-full shadow-none"
              aria-label="Open notifications"
            >
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              <div
                aria-hidden="true"
                class="bg-primary absolute top-0.5 right-0.5 size-1 rounded-full"
              />
            </Button>
            
            <NotificationMenu />
          </div>
          
          <UserMenu />
        </div>
      </div>
    </header>
</template>
