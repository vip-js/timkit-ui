<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
</script>
<template>
<header class="border-b px-4 md:px-6">
      <div class="flex h-16 items-center justify-between gap-4">
        
        <div>
          <Select defaultValue="orion-alpha-45" aria-label="Select AI model">
            <SelectTrigger class="[&>svg]:text-muted-foreground/80 **:data-desc:hidden [&>svg]:shrink-0">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              <SelectValue placeholder="Choose an AI model" />
            </SelectTrigger>
            <SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              <SelectGroup>
                <SelectLabel class="ps-2">Models</SelectLabel>
                <SelectItem value="orion-alpha-45">
                  Orion-Alpha 4.5
                  <span class="text-muted-foreground mt-1 block text-xs" data-desc>
                    Balanced performance and creativity
                  </span>
                </SelectItem>
                <SelectItem value="orion-code-4">
                  Orion-Code 4
                  <span class="text-muted-foreground mt-1 block text-xs" data-desc>
                    Optimized for code generation and understanding
                  </span>
                </SelectItem>
                <SelectItem value="nova-chat-4">
                  Nova-Chat 4
                  <span class="text-muted-foreground mt-1 block text-xs" data-desc>
                    Excels at natural, engaging conversations
                  </span>
                </SelectItem>
                <SelectItem value="galaxy-max-4">
                  Galaxy-Max 4
                  <span class="text-muted-foreground mt-1 block text-xs" data-desc>
                    Most powerful model for complex tasks
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        
        <div class="flex items-center justify-end gap-2">
          
          <Button
            size="icon"
            variant="ghost"
            class="text-muted-foreground size-8 rounded-full shadow-none"
            aria-label="Temporary chat"
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
          
          <UserMenu />
        </div>
      </div>
    </header>
</template>
