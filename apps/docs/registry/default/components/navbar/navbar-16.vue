<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
</script>
<template>
<header class="border-b px-4 md:px-6">
      <div class="flex h-16 items-center justify-between gap-4">
        
        <div class="relative flex-1">
          <Input id="navbar-16-id"
            class="peer h-8 w-full max-w-xs ps-8 pe-2"
            placeholder="Search..."
            type="search"
          />
          <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          
          <div class="inline-flex items-center gap-2 max-md:hidden">
            <Label for="navbar-16-id" class="text-sm font-medium">
              Test mode
            </Label>
            <Switch id="navbar-16-id" class="h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3"
              aria-label="Toggle switch"
            />
          </div>
          <div class="flex items-center gap-2">
            
            <Button
              size="icon"
              variant="ghost"
              class="text-muted-foreground size-8 rounded-full shadow-none"
              aria-label="Open layout menu"
            >
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            </Button>
            
            <InfoMenu />
            
            <NotificationMenu />
            
            <SettingsMenu />
          </div>
          
          <Button class="size-8 rounded-full" size="icon" aria-label="Add new item">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
        </div>
      </div>
    </header>
</template>
