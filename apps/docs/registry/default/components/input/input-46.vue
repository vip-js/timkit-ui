<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { OTPInput } from '@/components/ui/otpinput'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-46-id">OTP input (spaced)</Label>
      <OTPInput id="input-46-id"
        containerClassName="flex items-center gap-3 has-disabled:opacity-50" maxLength="4") => (
          <div class="flex gap-2">
            
          </div>
        )}
      />
      <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with 
        <a
          class="hover:text-foreground underline"
          href="https://github.com/guilhermerodz/input-otp"
          target="_blank"
          rel="noopener nofollow"
        >
          Input OTP
        </a>
      </p>
    </div>
</template>
