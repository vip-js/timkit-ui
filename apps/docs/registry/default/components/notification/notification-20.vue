<script setup lang="ts">
import { CircleCheckIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';
import { ToastAction } from '@/components/ui/toast-action';
import { ToastClose } from '@/components/ui/toast-close';
import { ToastDescription } from '@/components/ui/toast-description';
import { ToastProvider } from '@/components/ui/toast-provider';
import { ToastTitle } from '@/components/ui/toast-title';
import { ToastViewport } from '@/components/ui/toast-viewport';



</script>

<template>
  <ToastProvider swipeDirection="left"><Button variant="outline" @click="handleButtonClick">Custom toast
      </Button><Toast :open="open" @update:open="handleOpenChange" :onPause="pause" :onResume="resume"><div class="flex w-full justify-between gap-3"><CircleCheckIcon class="mt-0.5 shrink-0 text-emerald-500" :size="16" aria-hidden="true" /><div class="flex grow flex-col gap-3"><div class="space-y-1"><ToastTitle>Your request was completed!</ToastTitle><ToastDescription>It demonstrates that the task or request has been processed.
              </ToastDescription></div><div><ToastAction altText="Undo changes" as-child><Button size="sm">Undo changes</Button></ToastAction></div></div><ToastClose as-child><Button variant="ghost" class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent" aria-label="Close notification"><XIcon :size="16" class="opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" /></Button></ToastClose></div><div class="contents" aria-hidden="true"><div class="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-emerald-500" :style="{
              width: `${(progress / toastDuration) * 100}%`,
              transition: 'width 100ms linear',
            }" /></div></Toast><ToastViewport class="sm:right-auto sm:left-0" /></ToastProvider>
</template>
