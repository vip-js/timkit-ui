<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">OTP input single</Label><OTPInput :id="id" containerClassName="flex items-center gap-3 has-disabled:opacity-50" :maxLength="4" :render="({ slots }) => (
          <div className="flex">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )" /><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with{{ ' ' }}<a class="hover:text-foreground underline" href="https://github.com/guilhermerodz/input-otp" target="_blank" rel="noopener nofollow">Input OTP
        </a></p></div>
</template>
