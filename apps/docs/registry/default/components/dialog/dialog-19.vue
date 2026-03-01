<script setup lang="ts">
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProfileBg } from '@/components/ui/profile-bg'
import { Avatar } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
</script>
<template>
<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent class="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader class="contents space-y-0 text-left">
          <DialogTitle class="border-b px-6 py-4 text-base">Edit profile</DialogTitle>
        </DialogHeader>
        <DialogDescription class="sr-only">
          Make changes to your profile here. You can change your photo and set a username.
        </DialogDescription>
        <div class="overflow-y-auto">
          <ProfileBg />
          <Avatar />
          <div class="px-6 pt-4 pb-6">
            <form class="space-y-4">
              <div class="flex flex-col gap-4 sm:flex-row">
                <div class="flex-1 space-y-2">
                  <Label for="dialog-19-id">First name</Label>
                  <Input id="dialog-19-id"
                    placeholder="Matt"
                    defaultValue="Margaret"
                    type="text"
                    required
                  />
                </div>
                <div class="flex-1 space-y-2">
                  <Label for="dialog-19-id">Last name</Label>
                  <Input id="dialog-19-id"
                    placeholder="Welsh"
                    defaultValue="Villard"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div class="*:not-first:mt-2">
                <Label for="dialog-19-id">Username</Label>
                <div class="relative">
                  <Input id="dialog-19-id"
                    class="peer pe-9"
                    placeholder="Username"
                    defaultValue="margaret-villard-69"
                    type="text"
                    required
                  />
                  <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                     <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><circle cx="12" cy="12" r="9" /></svg>
                  </div>
                </div>
              </div>
              <div class="*:not-first:mt-2">
                <Label for="dialog-19-id">Website</Label>
                <div class="flex rounded-md shadow-xs">
                  <span class="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                    https://
                  </span>
                  <Input id="dialog-19-id"
                    class="-ms-px rounded-s-none shadow-none"
                    placeholder="yourwebsite.com"
                    defaultValue="www.margaret.com"
                    type="text"
                  />
                </div>
              </div>
              <div class="*:not-first:mt-2">
                <Label for="dialog-19-id">Biography</Label>
                <Textarea id="dialog-19-id"
                  placeholder="Write a few sentences about yourself" aria-describedby="dialog-19-id-description"
                />
                <p id="dialog-19-id"
                  class="text-muted-foreground mt-2 text-right text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span class="tabular-nums"></span> characters left
                </p>
              </div>
            </form>
          </div>
        </div>
        <DialogFooter class="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
</template>
