<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
</script>
<template>
<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">OTP code</Button>
      </DialogTrigger>
      <DialogContent>
        <div class="flex flex-col items-center gap-2">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              class="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle class="sm:text-center">Enter confirmation code</DialogTitle>
            <DialogDescription class="sm:text-center">
              Check your email and enter the code - Try 6548
            </DialogDescription>
          </DialogHeader>
        </div>

        <div class="space-y-4">
          <div class="flex justify-center">
            <div class="flex gap-2"><div class="border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs"></div><div class="border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs"></div><div class="border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs"></div><div class="border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs"></div></div>
          </div>
          <p class="text-center text-sm">
            <a class="underline hover:no-underline" href="#">
              Resend code
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
</template>
