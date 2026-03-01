<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
</script>
<template>
<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Invite members</Button>
      </DialogTrigger>
      <DialogContent >
        <div class="flex flex-col gap-2">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-80"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <DialogHeader>
            <DialogTitle class="text-left">Invite team members</DialogTitle>
            <DialogDescription class="text-left">
              Invite teammates to earn free components.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form class="space-y-5">
          <div class="space-y-4">
            <div class="*:not-first:mt-2">
              <Label>Invite via email</Label>
              <div class="space-y-3">
                
                  <Input
                    id="dialog-15-id-1"
                    placeholder="hi@yourcompany.com"
                    type="email"
                    value="mark@yourcompany.com" ref=undefined
                  />
                

                  <Input
                    id="dialog-15-id-2"
                    placeholder="hi@yourcompany.com"
                    type="email"
                    value="jane@yourcompany.com" ref=undefined
                  />
                

                  <Input
                    id="dialog-15-id-3"
                    placeholder="hi@yourcompany.com"
                    type="email"
                    value="" ref=undefined
                  />
                
              </div>
            </div>
            <button
              type="button" class="text-sm underline hover:no-underline"
            >
              + Add another
            </button>
          </div>
          <Button type="button" class="w-full">
            Send invites
          </Button>
        </form>

        <hr class="my-1 border-t" />

        <div class="*:not-first:mt-2">
          <Label for="dialog-15-id">Invite via magic link</Label>
          <div class="relative">
            <Input id="dialog-15-id"
              class="pe-9"
              type="text"
              defaultValue="https://ui.timkit.cn/refer/87689"
              readOnly
            />
            <TooltipProvider delayDuration="0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                    aria-label='Copy to clipboard'
                  >
                    <div
                    >
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-emerald-500"><circle cx="12" cy="12" r="9" /></svg>
                    </div>
                    <div
                    >
                       <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent class="px-2 py-1 text-xs">Copy to clipboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
</template>
