<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
            <PopoverContent align="start" class="w-36 p-1 md:hidden">
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
          <div class="flex items-center gap-6">
            
            <a href="#" class="text-primary hover:text-primary/90">
              <Logo />
            </a>
            
            <NavigationMenu class="hidden md:flex">
              <NavigationMenuList class="gap-2">
                <TooltipProvider>
                  
                    <NavigationMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavigationMenuLink
                            href=#
                            class="flex size-8 items-center justify-center p-1.5"
                          >
                             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                            <span class="sr-only">Dashboard</span>
                          </NavigationMenuLink>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" class="px-2 py-1 text-xs">
                          <p>Dashboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </NavigationMenuItem>
                  

                    <NavigationMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavigationMenuLink
                            href=#
                            class="flex size-8 items-center justify-center p-1.5"
                          >
                             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                            <span class="sr-only">Projects</span>
                          </NavigationMenuLink>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" class="px-2 py-1 text-xs">
                          <p>Projects</p>
                        </TooltipContent>
                      </Tooltip>
                    </NavigationMenuItem>
                  

                    <NavigationMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavigationMenuLink
                            href=#
                            class="flex size-8 items-center justify-center p-1.5"
                          >
                             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                            <span class="sr-only">Documentation</span>
                          </NavigationMenuLink>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" class="px-2 py-1 text-xs">
                          <p>Documentation</p>
                        </TooltipContent>
                      </Tooltip>
                    </NavigationMenuItem>
                  

                    <NavigationMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavigationMenuLink
                            href=#
                            class="flex size-8 items-center justify-center p-1.5"
                          >
                             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                            <span class="sr-only">Team</span>
                          </NavigationMenuLink>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" class="px-2 py-1 text-xs">
                          <p>Team</p>
                        </TooltipContent>
                      </Tooltip>
                    </NavigationMenuItem>
                  
                </TooltipProvider>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          
          <ThemeToggle />
          
          <Select defaultValue="en">
            <SelectTrigger id="navbar-06-id"
              class="[&>svg]:text-muted-foreground/80 hover:bg-accent hover:text-accent-foreground h-8 border-none px-2 shadow-none [&>svg]:shrink-0"
              aria-label="Select language"
            >
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              <SelectValue class="hidden sm:inline-flex" />
            </SelectTrigger>
            <SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
              
                <SelectItem value="en">
                  <span class="flex items-center gap-2">
                    <span class="truncate">En</span>
                  </span>
                </SelectItem>
              

                <SelectItem value="es">
                  <span class="flex items-center gap-2">
                    <span class="truncate">Es</span>
                  </span>
                </SelectItem>
              

                <SelectItem value="fr">
                  <span class="flex items-center gap-2">
                    <span class="truncate">Fr</span>
                  </span>
                </SelectItem>
              

                <SelectItem value="de">
                  <span class="flex items-center gap-2">
                    <span class="truncate">De</span>
                  </span>
                </SelectItem>
              

                <SelectItem value="ja">
                  <span class="flex items-center gap-2">
                    <span class="truncate">Ja</span>
                  </span>
                </SelectItem>
              
            </SelectContent>
          </Select>
          
          <UserMenu />
        </div>
      </div>
    </header>
</template>
