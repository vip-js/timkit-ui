<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';



</script>

<template>
  <Dialog><DialogTrigger as-child><Button variant="outline">OTP code</Button></DialogTrigger><DialogContent><div class="flex flex-col items-center gap-2"><div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><svg class="stroke-zinc-800 dark:stroke-zinc-100" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke-width="8" /></svg></div><DialogHeader><DialogTitle class="sm:text-center">{{ hasGuessed ? 'Code verified!' : 'Enter confirmation code' }}</DialogTitle><DialogDescription class="sm:text-center">{{ hasGuessed
                ? 'Your code has been successfully verified.'
                : `Check your email and enter the code - Try ${CORRECT_CODE}` }}</DialogDescription></DialogHeader></div>{{ hasGuessed ? (
          <div className="text-center">
            <DialogClose asChild>
              <Button type="button" ref={closeButtonRef}>
                Close
              </Button>
            </DialogClose>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <OTPInput
                id="cofirmation-code"
                ref={inputRef}
                value={value}
                onChange={setValue}
                containerClassName="flex items-center gap-3 has-disabled:opacity-50"
                maxLength={4}
                onFocus={() => setHasGuessed(undefined)}
                render={({ slots }) => (
                  <div className="flex gap-2">
                    {slots.map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                )}
                onComplete={onSubmit}
              />
            </div>
            {hasGuessed === false && (
              <p
                className="text-muted-foreground text-center text-xs"
                role="alert"
                aria-live="polite"
              >
                Invalid code. Please try again.
              </p>
            )}
            <p className="text-center text-sm">
              <a className="underline hover:no-underline" href="#">
                Resend code
              </a>
            </p>
          </div>
        ) }}</DialogContent></Dialog>
</template>
