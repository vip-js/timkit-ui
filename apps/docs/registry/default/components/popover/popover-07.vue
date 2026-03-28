<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@timui/core'
import {
  CheckIcon,
  CodeIcon,
  CopyIcon,
  FacebookIcon,
  MailIcon,
  TwitterIcon,
} from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Input } from '@timui/vue'
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue'
import { Tooltip } from '@timui/vue'
import { TooltipContent } from '@timui/vue'
import { TooltipProvider } from '@timui/vue'
import { TooltipTrigger } from '@timui/vue'

const id = 'popover-07'
const shareLink = 'https://ui.timkit.cn/Avx8HD'
const copied = ref(false)

const handleCopy = async () => {
  if (copied.value) return
  try {
    await navigator.clipboard.writeText(shareLink)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline">Share</Button>
      </PopoverTrigger>
      <PopoverContent class="w-72">
        <div class="flex flex-col gap-3 text-center">
          <div class="text-sm font-medium">Share code</div>
          <div class="flex flex-wrap justify-center gap-2">
            <Button size="icon" variant="outline" aria-label="Embed"><CodeIcon :size="16" aria-hidden="true" /></Button>
            <Button size="icon" variant="outline" aria-label="Share on Twitter"><TwitterIcon :size="16" aria-hidden="true" /></Button>
            <Button size="icon" variant="outline" aria-label="Share on Facebook"><FacebookIcon :size="16" aria-hidden="true" /></Button>
            <Button size="icon" variant="outline" aria-label="Share via email"><MailIcon :size="16" aria-hidden="true" /></Button>
          </div>
          <div class="space-y-2">
            <div class="relative">
              <Input :id="id" class="pe-9" type="text" :default-value="shareLink" aria-label="Share link" readOnly />
              <TooltipProvider :delayDuration="0">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button
                      class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                      :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
                      :disabled="copied"
                      @click="handleCopy"
                    >
                      <div :class="cn('transition-all', copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0')">
                        <CheckIcon class="stroke-emerald-500" :size="16" aria-hidden="true" />
                      </div>
                      <div :class="cn('absolute transition-all', copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100')">
                        <CopyIcon :size="16" aria-hidden="true" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent class="px-2 py-1 text-xs">Copy to clipboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
