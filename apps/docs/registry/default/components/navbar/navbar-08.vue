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
                  

                    <NavigationMenuItem class="w-full">
                      <NavigationMenuLink class="py-1.5">
                        
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          
          <div class="flex items-center">
            <a href="#" class="text-primary hover:text-primary/90">
              <Logo />
            </a>
          </div>
        </div>
        
        <div class="grow">
          
          <div class="relative mx-auto w-full max-w-xs">
            <Input id="navbar-08-id" class="peer h-8 ps-8 pe-10" placeholder="Search..." type="search" />
            <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            </div>
            <div class="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
              <kbd class="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
        
        <div class="flex flex-1 items-center justify-end gap-2">
          
          <NotificationMenu />
          
          <UserMenu />
        </div>
      </div>
      
      <div class="border-t py-2 max-md:hidden">
        
        <NavigationMenu>
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
            

              <NavigationMenuItem>
                <NavigationMenuLink
                  class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                >
                  
                </NavigationMenuLink>
              </NavigationMenuItem>
            
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
</template>
