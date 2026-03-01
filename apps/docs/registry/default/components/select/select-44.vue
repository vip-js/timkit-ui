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
      <Label for="select-44-id">Options with flag and search</Label>
      <Popover >
        <PopoverTrigger asChild>
          <Button id="select-44-id"
            variant="outline"
            role="combobox"
            class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span class="text-muted-foreground">Select country</span>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/80 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              
                
                  <CommandGroup heading=America>
                    
                      <CommandItem
                        value="United States" >
                        <span class="text-lg leading-none">🇺🇸</span> United States
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="Canada" >
                        <span class="text-lg leading-none">🇨🇦</span> Canada
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="Mexico" >
                        <span class="text-lg leading-none">🇲🇽</span> Mexico
                        
                      </CommandItem>
                    
                  </CommandGroup>
                
              

                
                  <CommandGroup heading=Africa>
                    
                      <CommandItem
                        value="South Africa" >
                        <span class="text-lg leading-none">🇿🇦</span> South Africa
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="Nigeria" >
                        <span class="text-lg leading-none">🇳🇬</span> Nigeria
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="Morocco" >
                        <span class="text-lg leading-none">🇲🇦</span> Morocco
                        
                      </CommandItem>
                    
                  </CommandGroup>
                
              

                
                  <CommandGroup heading=Asia>
                    
                      <CommandItem
                        value="China" >
                        <span class="text-lg leading-none">🇨🇳</span> China
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="Japan" >
                        <span class="text-lg leading-none">🇯🇵</span> Japan
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="India" >
                        <span class="text-lg leading-none">🇮🇳</span> India
                        
                      </CommandItem>
                    
                  </CommandGroup>
                
              

                
                  <CommandGroup heading=Europe>
                    
                      <CommandItem
                        value="United Kingdom" >
                        <span class="text-lg leading-none">🇬🇧</span> United Kingdom
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="France" >
                        <span class="text-lg leading-none">🇫🇷</span> France
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="Germany" >
                        <span class="text-lg leading-none">🇩🇪</span> Germany
                        
                      </CommandItem>
                    
                  </CommandGroup>
                
              

                
                  <CommandGroup heading=Oceania>
                    
                      <CommandItem
                        value="Australia" >
                        <span class="text-lg leading-none">🇦🇺</span> Australia
                        
                      </CommandItem>
                    

                      <CommandItem
                        value="New Zealand" >
                        <span class="text-lg leading-none">🇳🇿</span> New Zealand
                        
                      </CommandItem>
                    
                  </CommandGroup>
                
              
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
</template>
