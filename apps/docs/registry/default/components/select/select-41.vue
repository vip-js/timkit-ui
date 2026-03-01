<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Command } from '@/components/ui/command'
import { CommandInput } from '@/components/ui/command-input'
import { CommandList } from '@/components/ui/command-list'
import { CommandEmpty } from '@/components/ui/command-empty'
import { CommandGroup } from '@/components/ui/command-group'
import { CommandItem } from '@/components/ui/command-item'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-41-id">Select with search</Label>
      <Popover >
        <PopoverTrigger asChild>
          <Button id="select-41-id"
            variant="outline"
            role="combobox"
            class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span>
              'Select framework'
            </span>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/80 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                
                  <CommandItem
                    value="next.js" >
                    Next.js
                    
                  </CommandItem>
                

                  <CommandItem
                    value="sveltekit" >
                    SvelteKit
                    
                  </CommandItem>
                

                  <CommandItem
                    value="nuxt.js" >
                    Nuxt.js
                    
                  </CommandItem>
                

                  <CommandItem
                    value="remix" >
                    Remix
                    
                  </CommandItem>
                

                  <CommandItem
                    value="astro" >
                    Astro
                    
                  </CommandItem>
                

                  <CommandItem
                    value="angular" >
                    Angular
                    
                  </CommandItem>
                

                  <CommandItem
                    value="vue" >
                    Vue.js
                    
                  </CommandItem>
                

                  <CommandItem
                    value="react" >
                    React
                    
                  </CommandItem>
                

                  <CommandItem
                    value="ember" >
                    Ember.js
                    
                  </CommandItem>
                

                  <CommandItem
                    value="gatsby" >
                    Gatsby
                    
                  </CommandItem>
                

                  <CommandItem
                    value="eleventy" >
                    Eleventy
                    
                  </CommandItem>
                

                  <CommandItem
                    value="solid" >
                    SolidJS
                    
                  </CommandItem>
                

                  <CommandItem
                    value="preact" >
                    Preact
                    
                  </CommandItem>
                

                  <CommandItem
                    value="qwik" >
                    Qwik
                    
                  </CommandItem>
                

                  <CommandItem
                    value="alpine" >
                    Alpine.js
                    
                  </CommandItem>
                

                  <CommandItem
                    value="lit" >
                    Lit
                    
                  </CommandItem>
                
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
</template>
