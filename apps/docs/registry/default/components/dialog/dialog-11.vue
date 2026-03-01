<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
</script>
<template>
<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rating</Button>
      </DialogTrigger>
      <DialogContent class="flex flex-col gap-0 p-0 [&>button:last-child]:top-3.5">
        <DialogHeader class="contents space-y-0 text-left">
          <DialogTitle class="border-b px-6 py-4 text-base">Help us improve</DialogTitle>
        </DialogHeader>
        <div class="px-6 py-4">
          <form class="space-y-5">
            <div class="space-y-4">
              <div>
                <fieldset class="space-y-4">
                  <legend class="text-foreground text-lg leading-none font-semibold">
                    How hard was it to set up your account?
                  </legend>
                  <RadioGroup class="flex gap-0 -space-x-px rounded-md shadow-xs">
                    
                      <label
                        key=0
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        0
                      </label>
                    

                      <label
                        key=1
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        1
                      </label>
                    

                      <label
                        key=2
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        2
                      </label>
                    

                      <label
                        key=3
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        3
                      </label>
                    

                      <label
                        key=4
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        4
                      </label>
                    

                      <label
                        key=5
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        5
                      </label>
                    

                      <label
                        key=6
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        6
                      </label>
                    

                      <label
                        key=7
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        7
                      </label>
                    

                      <label
                        key=8
                        class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                      >
                        <RadioGroupItem id="dialog-11-id"
                          class="sr-only after:absolute after:inset-0"
                        />
                        8
                      </label>
                    
                  </RadioGroup>
                </fieldset>
                <div class="text-muted-foreground mt-2 flex justify-between text-xs">
                  <p>Very easy</p>
                  <p>Very dificult</p>
                </div>
              </div>

              <div class="*:not-first:mt-2">
                <Label>Why did you give this rating?</Label>
                <Textarea
                  id="feedback"
                  placeholder="How can we improve Timkit UI?"
                  aria-label="Send feedback"
                />
              </div>
            </div>
            <Button type="button" class="w-full">
              Send feedback
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
</template>
