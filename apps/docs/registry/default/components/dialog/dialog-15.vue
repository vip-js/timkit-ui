<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@timui/core';
import { CheckIcon, CopyIcon, UserRoundPlusIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';

const id = 'dialog-15';
const emails = ref(['mark@yourcompany.com', 'jane@yourcompany.com', '']);
const copied = ref(false);
const magicLink = ref('https://ui.timkit.cn/refer/87689');

function addEmail() {
  emails.value = [...emails.value, ''];
}

function handleEmailChange(index: number, value: string) {
  const nextEmails = [...emails.value];
  nextEmails[index] = value;
  emails.value = nextEmails;
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(magicLink.value);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">Invite members</Button>
    </DialogTrigger>
    <DialogContent>
      <div class="flex flex-col gap-2">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          <UserRoundPlusIcon class="opacity-80" :size="16" />
        </div>
        <DialogHeader>
          <DialogTitle class="text-left">Invite team members</DialogTitle>
          <DialogDescription class="text-left">Invite teammates to earn free components.</DialogDescription>
        </DialogHeader>
      </div>

      <form class="space-y-5">
        <div class="space-y-4">
          <div class="*:not-first:mt-2">
            <Label>Invite via email</Label>
            <div class="space-y-3">
              <Input
                v-for="(email, index) in emails"
                :key="index"
                :id="`team-email-${index + 1}`"
                placeholder="hi@yourcompany.com"
                type="email"
                :model-value="email"
                @update:modelValue="(value) => handleEmailChange(index, String(value ?? ''))"
              />
            </div>
          </div>
          <button type="button" @click="addEmail" class="text-sm underline hover:no-underline">+ Add another</button>
        </div>
        <Button type="button" class="w-full">Send invites</Button>
      </form>

      <hr class="my-1 border-t" />

      <div class="*:not-first:mt-2">
        <Label :htmlFor="id">Invite via magic link</Label>
        <div class="relative">
          <Input :id="id" class="pe-9" type="text" v-model="magicLink" readOnly />
          <TooltipProvider :delayDuration="0">
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click="handleCopy"
                  class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                  :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
                  :disabled="copied"
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
    </DialogContent>
  </Dialog>
</template>
