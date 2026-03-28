<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { CircleCheckIcon, XIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Toast } from '@timui/vue'
import { ToastAction } from '@timui/vue'
import { ToastClose } from '@timui/vue'
import { ToastDescription } from '@timui/vue'
import { ToastProvider } from '@timui/vue'
import { ToastTitle } from '@timui/vue'
import { ToastViewport } from '@timui/vue'

const open = ref(false)
const toastDuration = 5000
const progress = ref(toastDuration)
const timerRef = ref<number | null>(null)
const timerState = ref({
  startTime: 0,
  remaining: toastDuration,
  isPaused: false,
})

const cleanup = () => {
  if (timerRef.value !== null) {
    window.clearInterval(timerRef.value)
    timerRef.value = null
  }
}

const reset = () => {
  cleanup()
  progress.value = toastDuration
  timerState.value = {
    startTime: 0,
    remaining: toastDuration,
    isPaused: false,
  }
}

const start = () => {
  const state = timerState.value
  state.startTime = Date.now()
  state.isPaused = false
  cleanup()

  timerRef.value = window.setInterval(() => {
    const elapsed = Date.now() - state.startTime
    const remaining = Math.max(0, state.remaining - elapsed)
    progress.value = remaining

    if (remaining <= 0) {
      cleanup()
      open.value = false
    }
  }, 100)
}

const pause = () => {
  const state = timerState.value
  if (!state.isPaused) {
    cleanup()
    state.remaining = Math.max(0, state.remaining - (Date.now() - state.startTime))
    state.isPaused = true
  }
}

const resume = () => {
  const state = timerState.value
  if (state.isPaused && state.remaining > 0) {
    start()
  }
}

const handleOpenChange = (isOpen: boolean) => {
  open.value = isOpen
  if (isOpen) {
    reset()
    start()
  } else {
    cleanup()
  }
}

const handleButtonClick = () => {
  if (open.value) {
    open.value = false
    window.setTimeout(() => {
      handleOpenChange(true)
    }, 150)
    return
  }
  handleOpenChange(true)
}

onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <ToastProvider swipeDirection="left">
    <Button variant="outline" @click="handleButtonClick">Custom toast</Button>
    <Toast :open="open" @update:open="handleOpenChange" :onPause="pause" :onResume="resume">
      <div class="flex w-full justify-between gap-3">
        <CircleCheckIcon class="mt-0.5 shrink-0 text-emerald-500" :size="16" aria-hidden="true" />
        <div class="flex grow flex-col gap-3">
          <div class="space-y-1">
            <ToastTitle>Your request was completed!</ToastTitle>
            <ToastDescription>It demonstrates that the task or request has been processed.</ToastDescription>
          </div>
          <div>
            <ToastAction altText="Undo changes" as-child>
              <Button size="sm">Undo changes</Button>
            </ToastAction>
          </div>
        </div>
        <ToastClose as-child>
          <Button
            variant="ghost"
            class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            aria-label="Close notification"
          >
            <XIcon
              :size="16"
              class="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </ToastClose>
      </div>
      <div class="contents" aria-hidden="true">
        <div
          class="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-emerald-500"
          :style="{
            width: `${(progress / toastDuration) * 100}%`,
            transition: 'width 100ms linear',
          }"
        />
      </div>
    </Toast>
    <ToastViewport class="sm:right-auto sm:left-0" />
  </ToastProvider>
</template>
