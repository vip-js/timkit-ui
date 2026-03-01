<script setup lang="ts">
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
</script>
<template>
<Dialog >
      <DialogTrigger asChild>
        <Button variant="outline">Onboarding</Button>
      </DialogTrigger>
      <DialogContent class="gap-0 p-0 [&>button:last-child]:text-white">
        <div class="p-2">
          <img
            class="w-full rounded-md"
            src="/dialog-content.png" width="382" height="216"
            alt="dialog"
          />
        </div>
        <div class="space-y-6 px-6 pt-3 pb-6">
          <DialogHeader>
            <DialogTitle>Welcome to Timkit UI</DialogTitle>
            <DialogDescription>Discover a powerful collection of components designed to enhance your development workflow.</DialogDescription>
          </DialogHeader>
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div class="flex justify-center space-x-1.5 max-sm:order-1">
              
                <div
                  class="bg-primary size-1.5 rounded-full"
                />
              

                <div
                  class="bg-primary size-1.5 rounded-full opacity-20"
                />
              

                <div
                  class="bg-primary size-1.5 rounded-full opacity-20"
                />
              

                <div
                  class="bg-primary size-1.5 rounded-full opacity-20"
                />
              
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Skip
                </Button>
              </DialogClose>
              
                <Button class="group" type="button" >
                  Next
                   <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"><circle cx="12" cy="12" r="9" /></svg>
                </Button>
              
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
</template>
