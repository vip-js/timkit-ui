<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@timui/core";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";

type CalendarMode = "single" | "range";
type RangeValue = { from?: Date; to?: Date } | undefined;

const props = withDefaults(
  defineProps<{
    modelValue?: Date | RangeValue;
    defaultValue?: Date | RangeValue;
    mode?: CalendarMode;
    showOutsideDays?: boolean;
    numberOfMonths?: number;
    minDate?: Date;
    maxDate?: Date;
    isDateUnavailable?: (date: Date) => boolean;
    disabled?: boolean;
    class?: string;
    classNames?: Partial<Record<string, string>>;
  }>(),
  {
    mode: "single",
    showOutsideDays: true,
    numberOfMonths: 1,
  }
);

const emit = defineEmits(["update:modelValue", "change"]);

const internalValue = ref<Date | RangeValue | undefined>(
  props.modelValue ?? props.defaultValue
);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) internalValue.value = val;
  }
);

const value = computed(() => internalValue.value);
const selectedDate = computed(() =>
  props.mode === "single" && value.value instanceof Date ? value.value : undefined
);
const selectedRange = computed(() =>
  props.mode === "range" ? (value.value as RangeValue) : undefined
);

const today = new Date();
const getBaseMonth = () => {
  const base =
    (value.value && props.mode === "single" && value.value instanceof Date && value.value) ||
    (value.value && props.mode === "range" && (value.value as RangeValue)?.from) ||
    today;
  return new Date(base.getFullYear(), base.getMonth(), 1);
};

const currentMonth = ref<Date>(getBaseMonth());
const focusedDate = ref<Date>(
  selectedDate.value || selectedRange.value?.from || today
);

watch(
  () => value.value,
  () => {
    currentMonth.value = getBaseMonth();
    focusedDate.value = selectedDate.value || selectedRange.value?.from || today;
  }
);

watch(
  () => [currentMonth.value, props.numberOfMonths, props.minDate, props.maxDate, props.disabled],
  () => {
    ensureFocusVisible();
  }
);

const defaultClassNames = {
  months: "relative flex flex-col sm:flex-row gap-4",
  month: "w-full",
  month_caption: "relative mx-10 mb-1 flex h-9 items-center justify-center z-20",
  caption_label: "text-sm font-medium",
  nav: "absolute top-0 flex w-full justify-between z-10",
  button_previous: cn(
    buttonVariants({ variant: "ghost" }),
    "size-9 text-muted-foreground/80 hover:text-foreground p-0"
  ),
  button_next: cn(
    buttonVariants({ variant: "ghost" }),
    "size-9 text-muted-foreground/80 hover:text-foreground p-0"
  ),
  weekday: "size-9 p-0 text-xs font-medium text-muted-foreground/80",
  day_button:
    "relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 group-data-disabled:pointer-events-none focus-visible:z-10 hover:not-in-data-selected:bg-accent group-data-selected:bg-primary hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground group-data-disabled:text-foreground/30 group-data-disabled:line-through group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-[.range-middle]:group-data-selected:bg-accent group-[.range-middle]:group-data-selected:text-foreground",
  day: "group size-9 px-0 py-px text-sm",
  range_start: "range-start",
  range_end: "range-end",
  range_middle: "range-middle",
  today:
    "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
  outside: "text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground",
  hidden: "invisible",
  week_number: "size-9 p-0 text-xs font-medium text-muted-foreground/80",
};

const mergedClassNames = computed(() => {
  const merged: Record<string, string> = {};
  Object.keys(defaultClassNames).forEach((key) => {
    merged[key] = props.classNames?.[key]
      ? cn(defaultClassNames[key as keyof typeof defaultClassNames], props.classNames[key])
      : defaultClassNames[key as keyof typeof defaultClassNames];
  });
  return merged;
});

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);
const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

const months = computed(() => {
  return Array.from({ length: props.numberOfMonths }, (_, index) =>
    addMonths(currentMonth.value, index)
  );
});

const visibleRange = computed(() => {
  const first = months.value[0];
  const last = months.value[months.value.length - 1];
  const start = new Date(first.getFullYear(), first.getMonth(), 1);
  const end = new Date(last.getFullYear(), last.getMonth() + 1, 0);
  return { start, end };
});

const isSameDay = (a?: Date, b?: Date) =>
  a && b && a.toDateString() === b.toDateString();

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const isDateDisabled = (date: Date, outside: boolean) => {
  if (props.disabled) return true;
  if (!props.showOutsideDays && outside) return true;
  if (props.minDate && normalizeDate(date) < normalizeDate(props.minDate)) return true;
  if (props.maxDate && normalizeDate(date) > normalizeDate(props.maxDate)) return true;
  if (props.isDateUnavailable && props.isDateUnavailable(date)) return true;
  return false;
};

const isInRange = (date: Date, range?: RangeValue) => {
  if (!range?.from || !range?.to) return false;
  const time = date.getTime();
  return time >= range.from.getTime() && time <= range.to.getTime();
};

const selectDate = (date: Date) => {
  if (props.isDateUnavailable?.(date)) return;
  if (props.mode === "single") {
    internalValue.value = date;
    emit("update:modelValue", date);
    emit("change", date);
    return;
  }

  const current = (internalValue.value as RangeValue) || {};
  if (!current.from || (current.from && current.to)) {
    const next = { from: date, to: undefined };
    internalValue.value = next;
    emit("update:modelValue", next);
    emit("change", next);
    return;
  }

  const from = current.from;
  const to = date.getTime() < from.getTime() ? from : date;
  const nextFrom = date.getTime() < from.getTime() ? date : from;
  const next = { from: nextFrom, to };
  internalValue.value = next;
  emit("update:modelValue", next);
  emit("change", next);
};

const focusDate = (date: Date) => {
  focusedDate.value = date;
  if (
    date.getFullYear() !== currentMonth.value.getFullYear() ||
    date.getMonth() !== currentMonth.value.getMonth()
  ) {
    currentMonth.value = new Date(date.getFullYear(), date.getMonth(), 1);
  }
};

const clampToRange = (date: Date) => {
  if (props.minDate && normalizeDate(date) < normalizeDate(props.minDate)) {
    return props.minDate;
  }
  if (props.maxDate && normalizeDate(date) > normalizeDate(props.maxDate)) {
    return props.maxDate;
  }
  return date;
};

const findNearestEnabledInRange = (date: Date, forward: boolean) => {
  const { start, end } = visibleRange.value;
  let next = clampToRange(date);
  if (normalizeDate(next) < normalizeDate(start)) next = start;
  if (normalizeDate(next) > normalizeDate(end)) next = end;

  let guard = 0;
  while (isDateDisabled(next, false) && guard < 366) {
    next = addDays(next, forward ? 1 : -1);
    if (normalizeDate(next) < normalizeDate(start) || normalizeDate(next) > normalizeDate(end)) {
      break;
    }
    guard += 1;
  }
  return next;
};

const ensureFocusVisible = () => {
  const { start, end } = visibleRange.value;
  const focus = focusedDate.value;
  if (normalizeDate(focus) < normalizeDate(start)) {
    focusDate(findNearestEnabledInRange(start, true));
    return;
  }
  if (normalizeDate(focus) > normalizeDate(end)) {
    focusDate(findNearestEnabledInRange(end, false));
    return;
  }
  if (isDateDisabled(focus, false)) {
    focusDate(findNearestEnabledInRange(focus, true));
  }
};

const focusFirstInView = () => {
  const { start } = visibleRange.value;
  focusDate(findNearestEnabledInRange(start, true));
};

const focusLastInView = () => {
  const { end } = visibleRange.value;
  focusDate(findNearestEnabledInRange(end, false));
};

const moveFocus = (amount: number) => {
  let next = addDays(focusedDate.value, amount);
  let guard = 0;
  while (isDateDisabled(next, false) && guard < 365) {
    next = addDays(next, amount > 0 ? 1 : -1);
    guard += 1;
  }
  focusDate(clampToRange(next));
};

const moveMonthBoundary = (forward: boolean) => {
  const year = focusedDate.value.getFullYear();
  const month = focusedDate.value.getMonth();
  const date = focusedDate.value.getDate();
  let next = new Date(year, month + (forward ? 1 : -1), date);
  next = clampToRange(next);
  focusDate(next);
};

const onDayKeyDown = (event: KeyboardEvent, dayDate: Date, outside: boolean) => {
  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      moveFocus(-1);
      break;
    case "ArrowRight":
      event.preventDefault();
      moveFocus(1);
      break;
    case "ArrowUp":
      event.preventDefault();
      moveFocus(-7);
      break;
    case "ArrowDown":
      event.preventDefault();
      moveFocus(7);
      break;
    case "PageUp":
      event.preventDefault();
      moveMonthBoundary(false);
      break;
    case "PageDown":
      event.preventDefault();
      moveMonthBoundary(true);
      break;
    case "Home":
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        focusFirstInView();
      } else {
        focusDate(new Date(dayDate.getFullYear(), dayDate.getMonth(), 1));
      }
      break;
    case "End":
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        focusLastInView();
      } else {
        focusDate(new Date(dayDate.getFullYear(), dayDate.getMonth() + 1, 0));
      }
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      if (!isDateDisabled(dayDate, outside)) selectDate(dayDate);
      break;
    default:
      break;
  }
};

const onPrev = () => {
  currentMonth.value = addMonths(currentMonth.value, -1);
  ensureFocusVisible();
};

const onNext = () => {
  currentMonth.value = addMonths(currentMonth.value, 1);
  ensureFocusVisible();
};

const buildMonthGrid = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: { date: Date; outside: boolean }[] = [];
  for (let i = 0; i < startOffset; i++) {
    const date = new Date(year, month, i - startOffset + 1);
    days.push({ date, outside: true });
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push({ date: new Date(year, month, i), outside: false });
  }
  while (days.length % 7 !== 0) {
    const date = new Date(year, month, totalDays + (days.length - startOffset - totalDays) + 1);
    days.push({ date, outside: true });
  }

  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};
</script>

<template>
  <div :class="cn('w-fit', props.class)">
    <div :class="mergedClassNames.months">
      <div
        v-for="monthDate in months"
        :key="monthDate.toISOString()"
        :class="mergedClassNames.month"
      >
        <div :class="mergedClassNames.month_caption">
          <div :class="mergedClassNames.caption_label">
            {{ monthDate.toLocaleString("default", { month: "long", year: "numeric" }) }}
          </div>
          <div :class="mergedClassNames.nav">
            <button type="button" :class="mergedClassNames.button_previous" @click="onPrev">
              <ChevronLeftIcon :size="16" aria-hidden="true" />
            </button>
            <button type="button" :class="mergedClassNames.button_next" @click="onNext">
              <ChevronRightIcon :size="16" aria-hidden="true" />
            </button>
          </div>
        </div>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th v-for="weekday in weekDays" :key="weekday" :class="mergedClassNames.weekday">
                {{ weekday }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, weekIndex) in buildMonthGrid(monthDate)" :key="weekIndex">
              <td
                v-for="day in week"
                :key="day.date.toISOString()"
                :data-disabled="isDateDisabled(day.date, day.outside) || undefined"
                :class="
                  cn(
                    mergedClassNames.day,
                    day.outside && mergedClassNames.outside,
                    !props.showOutsideDays && day.outside && mergedClassNames.hidden,
                    props.mode === 'range' &&
                      isSameDay(day.date, selectedRange?.from) &&
                      mergedClassNames.range_start,
                    props.mode === 'range' &&
                      isSameDay(day.date, selectedRange?.to) &&
                      mergedClassNames.range_end,
                    props.mode === 'range' &&
                      isInRange(day.date, selectedRange) &&
                      mergedClassNames.range_middle,
                    isSameDay(day.date, today) && mergedClassNames.today
                  )
                "
                :data-selected="
                  props.mode === 'single'
                    ? isSameDay(day.date, selectedDate)
                    : isInRange(day.date, selectedRange) ||
                      isSameDay(day.date, selectedRange?.from) ||
                      isSameDay(day.date, selectedRange?.to)
                "
                :data-outside="day.outside || undefined"
              >
                <button
                  type="button"
                  :class="mergedClassNames.day_button"
                  :disabled="isDateDisabled(day.date, day.outside)"
                  :aria-disabled="isDateDisabled(day.date, day.outside) || undefined"
                  :aria-selected="
                    props.mode === 'single'
                      ? isSameDay(day.date, selectedDate)
                      : isInRange(day.date, selectedRange) ||
                        isSameDay(day.date, selectedRange?.from) ||
                      isSameDay(day.date, selectedRange?.to)
                  "
                  :aria-current="isSameDay(day.date, today) ? 'date' : undefined"
                  :tabindex="isSameDay(day.date, focusedDate.value) ? 0 : -1"
                  @focus="focusDate(day.date)"
                  @keydown="(event) => onDayKeyDown(event, day.date, day.outside)"
                  @click="() => { if (!isDateDisabled(day.date, day.outside)) selectDate(day.date) }"
                >
                  {{ day.date.getDate() }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
