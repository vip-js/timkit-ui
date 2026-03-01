<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MessageSquareText } from '@/components/ui/message-square-text'
import { UserRoundPlus } from '@/components/ui/user-round-plus'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
</script>
<template>
<header class="border-b px-4 md:px-6">
      <div class="flex h-16 items-center justify-between gap-4">
        
        <div class="flex items-center gap-2">
          <Button class="size-8" variant="ghost" size="icon" aria-label="Go back" asChild>
            <a href="#">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            </a>
          </Button>
          <h1 class="text-sm font-medium">Basic UI</h1>
        </div>
        
        <div class="flex items-center gap-2">
          
          <Button
            size="icon"
            variant="ghost"
            class="text-muted-foreground size-8 rounded-full shadow-none"
            aria-label="History"
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            class="text-muted-foreground size-8 rounded-full shadow-none"
            aria-label="Save"
          >
            <MessageSquareText size="16" aria-hidden="true" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            class="text-muted-foreground size-8 rounded-full shadow-none"
            aria-label="Add user"
          >
            <UserRoundPlus size="16" aria-hidden="true" />
          </Button>
          
          <div class="ml-2 flex items-center gap-2">
            <div class="relative">
              <Avatar>
                <AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              <span class="border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
                <span class="sr-only">Online</span>
              </span>
            </div>
            <div class="relative">
              <Avatar>
                <AvatarImage src="./avatar-80-06.jpg" alt="Martha Johnson" />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              <span class="border-background bg-muted-foreground absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2">
                <span class="sr-only">Online</span>
              </span>
            </div>
            <div class="relative">
              <Avatar>
                <AvatarImage src="./avatar-80-05.jpg" alt="Linda Green" />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              <span class="border-background bg-muted-foreground absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2">
                <span class="sr-only">Online</span>
              </span>
            </div>
            <Button
              variant="secondary"
              class="bg-secondary text-muted-foreground ring-background hover:bg-secondary hover:text-foreground flex size-8 items-center justify-center rounded-full text-xs"
              size="icon"
            >
              +3
            </Button>
          </div>
        </div>
      </div>
    </header>
</template>
