<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CalendarIcon } from 'lucide-vue-next';
import { Calendar } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { format } from 'date-fns';

const id = 'calendar-date-picker-16';
const today = new Date();

const month = ref<Date>(today);
const date = ref<Date | undefined>(today);
const inputValue = ref('');

function setMonth(next: Date) {
  month.value = next;
}

function handleDayPickerSelect(nextDate?: Date) {
  if (!nextDate) {
    inputValue.value = '';
    date.value = undefined;
    return;
  }

  date.value = nextDate;
  month.value = nextDate;
  inputValue.value = format(nextDate, 'yyyy-MM-dd');
}

function handleInputValueChange(nextValue: string) {
  inputValue.value = nextValue;

  if (!nextValue) {
    date.value = undefined;
    return;
  }

  const parsedDate = new Date(nextValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return;
  }

  date.value = parsedDate;
  month.value = parsedDate;
}

onMounted(() => {
  inputValue.value = format(today, 'yyyy-MM-dd');
});
</script>

<template>
  <div>
    <div class="rounded-md border">
      <Calendar
        mode="single"
        class="p-2"
        :selected="date"
        @update:modelValue="handleDayPickerSelect"
        :month="month"
        :onMonthChange="setMonth"
      />
      <div class="border-t p-3">
        <div class="flex items-center gap-3">
          <Label :htmlFor="id" class="text-xs">Enter date</Label>
          <div class="relative grow">
            <Input
              :id="id"
              type="date"
              :model-value="inputValue"
              @update:modelValue="(value) => handleInputValueChange(String(value ?? ''))"
              class="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              aria-label="Select date"
            />
            <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <CalendarIcon :size="16" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">
      Date input -
      <a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker</a>
    </p>
  </div>
</template>
