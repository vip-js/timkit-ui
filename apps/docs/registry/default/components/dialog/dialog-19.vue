<script setup lang="ts">
import { CheckIcon, ImagePlusIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCharacterLimit } from '@/registry/default/hooks/use-character-limit.vue';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload.vue';


</script>

<template>
  <Dialog><DialogTrigger as-child><Button variant="outline">Edit profile</Button></DialogTrigger><DialogContent class="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5"><DialogHeader class="contents space-y-0 text-left"><DialogTitle class="border-b px-6 py-4 text-base">Edit profile</DialogTitle></DialogHeader><DialogDescription class="sr-only">Make changes to your profile here. You can change your photo and set a username.
        </DialogDescription><div class="overflow-y-auto"><ProfileBg /><Avatar /><div class="px-6 pt-4 pb-6"><form class="space-y-4"><div class="flex flex-col gap-4 sm:flex-row"><div class="flex-1 space-y-2"><Label :htmlFor="`${id}-first-name`">First name</Label><Input :id="`${id}-first-name`" placeholder="Matt" default-value="Margaret" type="text" required /></div><div class="flex-1 space-y-2"><Label :htmlFor="`${id}-last-name`">Last name</Label><Input :id="`${id}-last-name`" placeholder="Welsh" default-value="Villard" type="text" required /></div></div><div class="*:not-first:mt-2"><Label :htmlFor="`${id}-username`">Username</Label><div class="relative"><Input :id="`${id}-username`" class="peer pe-9" placeholder="Username" default-value="margaret-villard-69" type="text" required /><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50"><CheckIcon :size="16" class="text-emerald-500" aria-hidden="true" /></div></div></div><div class="*:not-first:mt-2"><Label :htmlFor="`${id}-website`">Website</Label><div class="flex rounded-md shadow-xs"><span class="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">https://
                  </span><Input :id="`${id}-website`" class="-ms-px rounded-s-none shadow-none" placeholder="yourwebsite.com" default-value="www.margaret.com" type="text" /></div></div><div class="*:not-first:mt-2"><Label :htmlFor="`${id}-bio`">Biography</Label><Textarea :id="`${id}-bio`" placeholder="Write a few sentences about yourself" :default-value="value" :maxLength="maxLength" :onChange="handleChange" :aria-describedby="`${id}-description`" /><p :id="`${id}-description`" class="text-muted-foreground mt-2 text-right text-xs" role="status" aria-live="polite"><span class="tabular-nums">{{ limit - characterCount }}</span>characters left
                </p></div></form></div></div><DialogFooter class="border-t px-6 py-4"><DialogClose as-child><Button type="button" variant="outline">Cancel
            </Button></DialogClose><DialogClose as-child><Button type="button">Save changes</Button></DialogClose></DialogFooter></DialogContent></Dialog>
</template>
