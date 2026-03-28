<script setup lang="ts">
import { computed, ref } from 'vue';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-vue-next';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';

const password = ref('');
const isVisible = ref<boolean>(false);
const id = 'input-52';

function toggleVisibility() {
  isVisible.value = !isVisible.value;
}

const strength = computed(() => checkStrength(password.value));
const strengthScore = computed(() => strength.value.filter((req) => req.met).length);

function checkStrength(pass: string) {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[0-9]/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(pass),
    text: req.text,
  }));
}

function getStrengthColor(score: number) {
  if (score === 0) return 'bg-border';
  if (score <= 1) return 'bg-red-500';
  if (score <= 2) return 'bg-orange-500';
  if (score === 3) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getStrengthText(score: number) {
  if (score === 0) return 'Enter a password';
  if (score <= 2) return 'Weak password';
  if (score === 3) return 'Medium password';
  return 'Strong password';
}
</script>

<template>
  <div>
    <div class="*:not-first:mt-2">
      <Label :htmlFor="id">Input with password strength indicator</Label>
      <div class="relative">
        <Input
          :id="id"
          class="pe-9"
          placeholder="Password"
          :type="isVisible ? 'text' : 'password'"
          v-model="password"
          :aria-describedby="`${id}-description`"
        />
        <button
          class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          @click="toggleVisibility"
          :aria-label="isVisible ? 'Hide password' : 'Show password'"
          :aria-pressed="isVisible"
          aria-controls="password"
        >
          <template v-if="isVisible"><EyeOffIcon :size="16" aria-hidden="true" /></template>
          <template v-else><EyeIcon :size="16" aria-hidden="true" /></template>
        </button>
      </div>
    </div>

    <div class="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full" role="progressbar" :aria-valuenow="strengthScore" :aria-valuemin="0" :aria-valuemax="4" aria-label="Password strength">
      <div :class="`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`" :style="{ width: `${(strengthScore / 4) * 100}%` }"></div>
    </div>

    <p :id="`${id}-description`" class="text-foreground mb-2 text-sm font-medium">{{ getStrengthText(strengthScore) }}. Must contain:</p>
    <ul class="space-y-1.5" aria-label="Password requirements">
      <li v-for="(req, index) in strength" :key="index" class="flex items-center gap-2">
        <template v-if="req.met"><CheckIcon :size="16" class="text-emerald-500" aria-hidden="true" /></template>
        <template v-else><XIcon :size="16" class="text-muted-foreground/80" aria-hidden="true" /></template>
        <span :class="`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`">
          {{ req.text }}
          <span class="sr-only">{{ req.met ? ' - Requirement met' : ' - Requirement not met' }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>
