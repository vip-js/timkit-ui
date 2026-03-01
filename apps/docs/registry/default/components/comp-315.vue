<script setup lang="ts">
import { TkButton, TkDialog, TkDialogTrigger, TkDialogContent, TkDialogHeader, TkDialogTitle, TkDialogDescription, TkDialogFooter, TkDialogClose } from '@timui/vue'
</script>

<template>
  <TkDialog>
    <TkDialogTrigger as-child>
      <TkButton variant="outline">Scrollable (native scrollbar)</TkButton>
    </TkDialogTrigger>
    <TkDialogContent class="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden">
      <div class="overflow-y-auto">
        <TkDialogHeader class="contents space-y-0 text-left">
          <TkDialogTitle class="px-6 pt-6">Frequently Asked Questions (FAQ)</TkDialogTitle>
          <TkDialogDescription as-child>
            <div class="p-6">
              <div class="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                <div class="space-y-1">
                  <p><strong>Account Management</strong></p>
                  <p>Navigate to the registration page, provide required information, and verify your email address. You can sign up using your email or through social media platforms.</p>
                </div>
                <div class="space-y-1">
                  <p><strong>Password Reset Process</strong></p>
                  <p>Users can reset their password through the account settings page. Click "Forgot Password" and follow the email verification steps to regain account access quickly and securely.</p>
                </div>
                <div class="space-y-1">
                  <p><strong>Service Pricing Tiers</strong></p>
                  <p>We offer three primary subscription levels designed to meet diverse user needs: Basic (free with limited features), Professional (monthly fee with comprehensive access), and Enterprise (custom pricing with full platform capabilities).</p>
                </div>
                <div class="space-y-1">
                  <p><strong>Technical Support Channels</strong></p>
                  <p>Customer support is accessible through multiple communication methods including email support, live chat during business hours, an integrated support ticket system, and phone support specifically for enterprise-level customers.</p>
                </div>
              </div>
            </div>
          </TkDialogDescription>
        </TkDialogHeader>
        <TkDialogFooter class="px-6 pb-6 sm:justify-start">
          <TkDialogClose as-child>
            <TkButton type="button" variant="outline">Cancel</TkButton>
          </TkDialogClose>
          <TkDialogClose as-child>
            <TkButton type="button">Okay</TkButton>
          </TkDialogClose>
        </TkDialogFooter>
      </div>
    </TkDialogContent>
  </TkDialog>
</template>
