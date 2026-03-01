<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
</script>
<template>
<div class="flex flex-col items-center gap-2">
      <div class="relative inline-flex">
        
        <button
          class="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
          aria-label='Upload image'
        >
          <div aria-hidden="true">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            </div>
        </button>
        
        
        <input
          class="sr-only"
          aria-label="Upload image file"
        />
      </div>

      
      <Dialog >
        <DialogContent class="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
          <DialogDescription class="sr-only">Crop image dialog</DialogDescription>
          <DialogHeader class="contents space-y-0 text-left">
            <DialogTitle class="flex items-center justify-between border-b p-4 text-base">
              <div class="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="-my-1 opacity-60" aria-label="Cancel"
                >
                   <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                </Button>
                <span>Crop image</span>
              </div>
              <Button class="-my-1" autoFocus>
                Apply
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <DialogFooter class="border-t px-4 py-6">
            <div class="mx-auto flex w-full max-w-80 items-center gap-4">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              <Slider min="1" max="3" aria-label="Zoom slider"
              />
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">
        Avatar 
        <a
          href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
          class="hover:text-foreground underline"
          target="_blank"
        >
          uploader
        </a> 
        with 
        <a
          href="https://github.com/origin-space/image-cropper"
          class="hover:text-foreground underline"
          target="_blank"
        >
          cropper
        </a>
      </p>
    </div>
</template>
