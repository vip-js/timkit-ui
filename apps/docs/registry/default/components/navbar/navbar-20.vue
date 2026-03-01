<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
</script>
<template>
<header class="border-b px-4 md:px-6">
      <div class="flex h-16 justify-between gap-4">
        
        <div class="flex gap-2">
          <div class="flex items-center md:hidden">
            
            <Popover>
              <PopoverTrigger asChild>
                <Button class="group size-8" variant="ghost" size="icon">
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
          </div>
          
          <div class="flex items-center gap-6">
            
            <NavigationMenu class="h-full *:h-full max-md:hidden">
              <NavigationMenuList class="h-full gap-2">
                
                  <NavigationMenuItem class="h-full">
                    <NavigationMenuLink
                      class="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                    >
                      
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                

                  <NavigationMenuItem class="h-full">
                    <NavigationMenuLink
                      class="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                    >
                      
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                

                  <NavigationMenuItem class="h-full">
                    <NavigationMenuLink
                      class="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                    >
                      
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="gap-1.5 text-emerald-600">
              <span class="size-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
              Online
            </Badge>
            <Badge variant="outline" class="gap-1.5">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-ms-0.5 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              99.9%
            </Badge>
            <Badge variant="outline" class="gap-1.5">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-ms-0.5 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              45ms
            </Badge>
          </div>
          
          <div>
            <div class="relative inline-grid h-7 grid-cols-[1fr_1fr] items-center text-sm font-medium">
              <Switch id="navbar-20-id" class="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
              />
              <span class="pointer-events-none relative ms-0.5 flex w-6 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </span>
              <span class="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex w-6 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </span>
            </div>
            <Label for="navbar-20-id" class="sr-only">
              Power
            </Label>
          </div>
        </div>
      </div>
    </header>
</template>
