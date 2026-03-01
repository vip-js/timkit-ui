<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
</script>
<template>
<Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" class="relative" aria-label="Open notifications">
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-80 p-1">
        <div class="flex items-baseline justify-between gap-4 px-3 py-2">
          <div class="text-sm font-semibold">Notifications</div>
          
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          class="bg-border -mx-1 my-1 h-px"
        ></div>
        
          <div
            class="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
          >
            <div class="relative flex items-start pe-3">
              <div class="flex-1 space-y-1">
                <button
                  class="text-foreground/80 text-left after:absolute after:inset-0" >
                  <span class="text-foreground font-medium hover:underline">
                    Chris Tompson
                  </span> 
                  requested review on 
                  <span class="text-foreground font-medium hover:underline">
                    PR #42: Feature implementation
                  </span>
                  .
                </button>
                <div class="text-muted-foreground text-xs">15 minutes ago</div>
              </div>
              
            </div>
          </div>
        

          <div
            class="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
          >
            <div class="relative flex items-start pe-3">
              <div class="flex-1 space-y-1">
                <button
                  class="text-foreground/80 text-left after:absolute after:inset-0" >
                  <span class="text-foreground font-medium hover:underline">
                    Emma Davis
                  </span> 
                  shared 
                  <span class="text-foreground font-medium hover:underline">
                    New component library
                  </span>
                  .
                </button>
                <div class="text-muted-foreground text-xs">45 minutes ago</div>
              </div>
              
            </div>
          </div>
        

          <div
            class="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
          >
            <div class="relative flex items-start pe-3">
              <div class="flex-1 space-y-1">
                <button
                  class="text-foreground/80 text-left after:absolute after:inset-0" >
                  <span class="text-foreground font-medium hover:underline">
                    James Wilson
                  </span> 
                  assigned you to 
                  <span class="text-foreground font-medium hover:underline">
                    API integration task
                  </span>
                  .
                </button>
                <div class="text-muted-foreground text-xs">4 hours ago</div>
              </div>
              
            </div>
          </div>
        

          <div
            class="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
          >
            <div class="relative flex items-start pe-3">
              <div class="flex-1 space-y-1">
                <button
                  class="text-foreground/80 text-left after:absolute after:inset-0" >
                  <span class="text-foreground font-medium hover:underline">
                    Alex Morgan
                  </span> 
                  replied to your comment in 
                  <span class="text-foreground font-medium hover:underline">
                    Authentication flow
                  </span>
                  .
                </button>
                <div class="text-muted-foreground text-xs">12 hours ago</div>
              </div>
              
            </div>
          </div>
        

          <div
            class="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
          >
            <div class="relative flex items-start pe-3">
              <div class="flex-1 space-y-1">
                <button
                  class="text-foreground/80 text-left after:absolute after:inset-0" >
                  <span class="text-foreground font-medium hover:underline">
                    Sarah Chen
                  </span> 
                  commented on 
                  <span class="text-foreground font-medium hover:underline">
                    Dashboard redesign
                  </span>
                  .
                </button>
                <div class="text-muted-foreground text-xs">2 days ago</div>
              </div>
              
            </div>
          </div>
        

          <div
            class="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
          >
            <div class="relative flex items-start pe-3">
              <div class="flex-1 space-y-1">
                <button
                  class="text-foreground/80 text-left after:absolute after:inset-0" >
                  <span class="text-foreground font-medium hover:underline">
                    Miky Derya
                  </span> 
                  mentioned you in 
                  <span class="text-foreground font-medium hover:underline">
                    Timkit UI open graph image
                  </span>
                  .
                </button>
                <div class="text-muted-foreground text-xs">2 weeks ago</div>
              </div>
              
            </div>
          </div>
        
      </PopoverContent>
    </Popover>
</template>
