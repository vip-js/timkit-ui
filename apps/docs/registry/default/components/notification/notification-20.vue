<script setup lang="ts">
import { ToastProvider } from '@/components/ui/toast-provider'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/ui/toast'
import { ToastTitle } from '@/components/ui/toast-title'
import { ToastDescription } from '@/components/ui/toast-description'
import { ToastAction } from '@/components/ui/toast-action'
import { ToastClose } from '@/components/ui/toast-close'
import { ToastViewport } from '@/components/ui/toast-viewport'
</script>
<template>
<ToastProvider swipeDirection="left">
      <Button variant="outline" >
        Custom toast
      </Button>
      <Toast >
        <div class="flex w-full justify-between gap-3">
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0 text-emerald-500"><circle cx="12" cy="12" r="9" /></svg>
          <div class="flex grow flex-col gap-3">
            <div class="space-y-1">
              <ToastTitle>Your request was completed!</ToastTitle>
              <ToastDescription>
                It demonstrates that the task or request has been processed.
              </ToastDescription>
            </div>
            <div>
              <ToastAction altText="Undo changes" asChild>
                <Button size="sm">Undo changes</Button>
              </ToastAction>
            </div>
          </div>
          <ToastClose asChild>
            <Button
              variant="ghost"
              class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Close notification"
            >
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 transition-opacity group-hover:opacity-100"><circle cx="12" cy="12" r="9" /></svg>
            </Button>
          </ToastClose>
        </div>
        <div class="contents" aria-hidden="true">
          <div
            class="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-emerald-500"}
          />
        </div>
      </Toast>
      <ToastViewport class="sm:right-auto sm:left-0" />
    </ToastProvider>
</template>
