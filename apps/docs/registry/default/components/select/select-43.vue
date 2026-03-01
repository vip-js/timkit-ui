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
      <Label for="select-43-id">Timezone select with search</Label>
      <Popover >
        <PopoverTrigger asChild>
          <Button id="select-43-id"
            variant="outline"
            role="combobox"
            class="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span>
              'Select timezone'
            </span>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/80 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          class="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command
          >
            <CommandInput placeholder="Search timezone..." />
            <CommandList>
              <CommandEmpty>No timezone found.</CommandEmpty>
              <CommandGroup>
                
                  <CommandItem >
                    (GMT+0) Europe/London
                    
                  </CommandItem>
                

                  <CommandItem >
                    (GMT-4) America/New York
                    
                  </CommandItem>
                

                  <CommandItem >
                    (GMT+8) Asia/Shanghai
                    
                  </CommandItem>
                
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
</template>
