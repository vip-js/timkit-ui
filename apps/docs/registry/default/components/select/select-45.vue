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
      <Label for="select-45-id">Options with icon and number</Label>
      <Popover >
        <PopoverTrigger asChild>
          <Button id="select-45-id"
            variant="outline"
            role="combobox"
            class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span class="text-muted-foreground">Select service category</span>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/80 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search services..." />
            <CommandList>
              <CommandEmpty>No service found.</CommandEmpty>
              <CommandGroup>
                
                  <CommandItem
                    value="analytics platform"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Analytics Platform
                    </div>
                    <span class="text-muted-foreground text-xs">
                      2451
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="ai services"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      AI Services
                    </div>
                    <span class="text-muted-foreground text-xs">
                      1832
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="database systems"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Database Systems
                    </div>
                    <span class="text-muted-foreground text-xs">
                      1654
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="compute resources"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Compute Resources
                    </div>
                    <span class="text-muted-foreground text-xs">
                      943
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="network services"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Network Services
                    </div>
                    <span class="text-muted-foreground text-xs">
                      832
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="web services"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Web Services
                    </div>
                    <span class="text-muted-foreground text-xs">
                      654
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="monitoring tools"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Monitoring Tools
                    </div>
                    <span class="text-muted-foreground text-xs">
                      432
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="server management"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Server Management
                    </div>
                    <span class="text-muted-foreground text-xs">
                      321
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="infrastructure"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Infrastructure
                    </div>
                    <span class="text-muted-foreground text-xs">
                      234
                    </span>
                  </CommandItem>
                

                  <CommandItem
                    value="frontend services"  class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                      Frontend Services
                    </div>
                    <span class="text-muted-foreground text-xs">
                      123
                    </span>
                  </CommandItem>
                
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
</template>
