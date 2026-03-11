<script setup lang="ts">
import { cn } from '@/lib/utils';
import { MinusIcon } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">OTP input double</Label><OTPInput :id="id" containerClassName="flex items-center gap-3 has-disabled:opacity-50" :maxLength="6" :render="({ slots }) => (
          <>
            <div className="flex">
              {slots.slice(0, 3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>

            <div className="text-muted-foreground/80">
              <MinusIcon size={16} aria-hidden="true" />
            </div>

            <div className="flex">
              {slots.slice(3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>
          </>
        )" /><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with{{ ' ' }}<a class="hover:text-foreground underline" href="https://github.com/guilhermerodz/input-otp" target="_blank" rel="noopener nofollow">Input OTP
        </a></p></div>
</template>
