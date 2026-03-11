<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CheckIcon, CopyIcon, UserRoundPlusIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';



</script>

<template>
  <Dialog><DialogTrigger as-child><Button variant="outline">Invite members</Button></DialogTrigger><DialogContent :onOpenAutoFocus="(e) => {
          e.preventDefault()
          lastInputRef.current?.focus()
        }"><div class="flex flex-col gap-2"><div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><UserRoundPlusIcon class="opacity-80" :size="16" /></div><DialogHeader><DialogTitle class="text-left">Invite team members</DialogTitle><DialogDescription class="text-left">Invite teammates to earn free components.
            </DialogDescription></DialogHeader></div><form class="space-y-5"><div class="space-y-4"><div class="*:not-first:mt-2"><Label>Invite via email</Label><div class="space-y-3"><Input v-for="(email, index) in emails" :key="index" :key="index" :id="`team-email-${index + 1}`" placeholder="hi@yourcompany.com" type="email" :value="email" :onChange="(e) => handleEmailChange(index, e.target.value)" :ref="index === emails.length - 1 ? lastInputRef : undefined" /></div></div><button type="button" @click="addEmail" class="text-sm underline hover:no-underline">+ Add another
            </button></div><Button type="button" class="w-full">Send invites
          </Button></form><hr class="my-1 border-t" /><div class="*:not-first:mt-2"><Label :htmlFor="id">Invite via magic link</Label><div class="relative"><Input :ref="inputRef" :id="id" class="pe-9" type="text" default-value="https://ui.timkit.cn/refer/87689" readOnly /><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><button @click="handleCopy" class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed" :aria-label="copied ? 'Copied' : 'Copy to clipboard'" :disabled="copied"><div :class="cn(
                        'transition-all',
                        copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      )"><CheckIcon class="stroke-emerald-500" :size="16" aria-hidden="true" /></div><div :class="cn(
                        'absolute transition-all',
                        copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                      )"><CopyIcon :size="16" aria-hidden="true" /></div></button></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Copy to clipboard</TooltipContent></Tooltip></TooltipProvider></div></div></DialogContent></Dialog>
</template>
