<script setup lang="ts">
import { computed } from "vue";
import type {
  AssertNoExtraKeys,
  CalendarApi,
  CalendarVueValue,
  CalendarVueProps,
} from "@timui/core";
import {
  calendarCaptionLabelVariants,
  calendarDayButtonVariants,
  calendarDayVariants,
  calendarGridVariants,
  calendarHiddenVariants,
  calendarMonthCaptionVariants,
  calendarMonthVariants,
  calendarMonthsVariants,
  calendarNavButtonVariants,
  calendarNavVariants,
  calendarOutsideVariants,
  calendarRangeEndVariants,
  calendarRangeMiddleVariants,
  calendarRangeStartVariants,
  calendarRootVariants,
  calendarTodayVariants,
  calendarWeekNumberVariants,
  calendarWeekdayVariants,
  cn,
  buttonVariants,
} from "@timui/core";
import type { VisibleRange } from "@zag-js/date-picker";
import { useCalendar } from "./use-calendar";

type CalendarProps = CalendarVueProps & {
  id?: string;
  selected?: CalendarVueValue;
  onSelect?: (value?: CalendarVueValue) => void;
  class?: string;
  classNames?: Partial<Record<string, string>>;
  externalApi?: CalendarApi;
};

type _CalendarPropsGuard = AssertNoExtraKeys<
  CalendarProps,
  CalendarVueProps & {
    id?: string;
    selected?: CalendarVueValue;
    onSelect?: (value?: CalendarVueValue) => void;
    class?: string;
    classNames?: Partial<Record<string, string>>;
    externalApi?: CalendarApi;
  }
>;

const props = withDefaults(defineProps<CalendarProps>(), {
  mode: "single",
  showOutsideDays: true,
  numberOfMonths: 1,
});

const emit = defineEmits<{
  (e: "update:modelValue", value?: Date | Date[] | { from?: Date; to?: Date }): void;
  (e: "change", value?: Date | Date[] | { from?: Date; to?: Date }): void;
}>();

const { api: internalApi, localTimeZone } = useCalendar(props, emit);
const api = computed(() => props.externalApi ?? internalApi.value);

const defaultClassNames = {
  months: calendarMonthsVariants(),
  month: calendarMonthVariants(),
  month_caption: calendarMonthCaptionVariants(),
  caption_label: calendarCaptionLabelVariants(),
  nav: calendarNavVariants(),
  button_previous: cn(buttonVariants({ variant: "ghost" }), calendarNavButtonVariants()),
  button_next: cn(buttonVariants({ variant: "ghost" }), calendarNavButtonVariants()),
  weekday: calendarWeekdayVariants(),
  day_button: calendarDayButtonVariants(),
  day: calendarDayVariants(),
  range_start: calendarRangeStartVariants(),
  range_end: calendarRangeEndVariants(),
  range_middle: calendarRangeMiddleVariants(),
  today: calendarTodayVariants(),
  outside: calendarOutsideVariants(),
  hidden: calendarHiddenVariants(),
  week_number: calendarWeekNumberVariants(),
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

const weekDays = computed(() => api.value?.weekDays ?? []);

const monthSelectProps = computed(() => api.value?.getMonthSelectProps?.() ?? {});
const yearSelectProps = computed(() => api.value?.getYearSelectProps?.() ?? {});
const monthOptions = computed(() =>
  api.value?.getMonths?.({ format: "long" }).map((item) => ({
    value: item.value,
    label: item.label,
    disabled: item.disabled,
  })) ?? []
);
const yearOptions = computed(() =>
  api.value?.getYears?.().map((item) => ({
    value: item.value,
    label: item.label,
    disabled: item.disabled,
  })) ?? []
);
const showDropdownCaption = computed(
  () => props.captionLayout === "dropdown" || props.captionLayout === "dropdown-years"
);

const getIsoWeekNumber = (date: Date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const monthData = computed(() => {
  const instance = api.value;
  if (!instance) return [];

  const count = Math.max(1, props.numberOfMonths ?? 1);
  const start = instance.visibleRange?.start;
  if (!start) return [];

  return Array.from({ length: count }, (_, index) => {
    const monthStart = start.add({ months: index });
    const id = `month-${index}`;
    const visibleRange: VisibleRange = {
      start: monthStart,
      end: monthStart.add({ months: 1 }).subtract({ days: 1 }),
    };
    const weeks = instance.getMonthWeeks(monthStart).map((week, weekIndex) => {
      const weekNumber = getIsoWeekNumber(week[0].toDate(localTimeZone));
      const days = week.map((day, dayIndex) => {
        const state = instance.getDayTableCellState?.({
          value: day,
          visibleRange,
        }) ?? {};
        const cellProps = instance.getDayTableCellProps?.({ value: day, visibleRange }) ?? {};
        const triggerProps =
          instance.getDayTableCellTriggerProps?.({ value: day, visibleRange }) ?? {};

        return {
          key: `${id}-${weekIndex}-${dayIndex}-${day.toString()}`,
          label: day.day,
          cellProps,
          triggerProps,
          state,
          className: cn(
            mergedClassNames.value.day,
            state.outsideRange && mergedClassNames.value.outside,
            !props.showOutsideDays && state.outsideRange && mergedClassNames.value.hidden,
            state.firstInRange && mergedClassNames.value.range_start,
            state.lastInRange && mergedClassNames.value.range_end,
            state.inRange &&
              !state.firstInRange &&
              !state.lastInRange &&
              mergedClassNames.value.range_middle,
            state.today && mergedClassNames.value.today
          ),
        };
      });

      return {
        key: `${id}-${weekIndex}`,
        weekNumber,
        days,
      };
    });

    return {
      id,
      weeks,
      label: instance.format(monthStart, { month: "long", year: "numeric" }),
      tableProps: instance.getTableProps?.({ view: "day", id }) ?? {},
      tableHeadProps: instance.getTableHeadProps?.({ view: "day", id }) ?? {},
      tableBodyProps: instance.getTableBodyProps?.({ view: "day", id }) ?? {},
      tableRowProps: instance.getTableRowProps?.({ view: "day", id }) ?? {},
      tableHeaderProps: instance.getTableHeaderProps?.({ view: "day", id }) ?? {},
    };
  });
});

const rootProps = computed(() => api.value?.getRootProps?.() ?? {});
const prevTriggerProps = computed(() => api.value?.getPrevTriggerProps?.({ view: "day" }) ?? {});
const nextTriggerProps = computed(() => api.value?.getNextTriggerProps?.({ view: "day" }) ?? {});

const getTriggerClass = (triggerProps: object) => {
  if (!triggerProps || typeof triggerProps !== "object") return "";
  const className = (triggerProps as { class?: object }).class;
  return typeof className === "string" ? className : "";
};
</script>

<template>
  <div
    v-bind="rootProps"
    data-slot="calendar"
    :class="cn(calendarRootVariants(), rootProps.class, props.class)"
  >
    <div :class="mergedClassNames.months">
      <div
        v-for="(month, index) in monthData"
        :key="month.id"
        :class="mergedClassNames.month"
      >
        <div :class="mergedClassNames.month_caption">
          <div :class="mergedClassNames.caption_label">
            <template v-if="index === 0 && showDropdownCaption">
              <div class="flex items-center gap-2">
                <select
                  v-if="props.captionLayout === 'dropdown'"
                  v-bind="monthSelectProps"
                  :class="cn('h-8 rounded-md border px-2 text-sm', monthSelectProps.class)"
                >
                  <option
                    v-for="option in monthOptions"
                    :key="option.value"
                    :value="String(option.value)"
                    :disabled="option.disabled"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <span v-else>{{ month.label.replace(/\s+\d{4}$/, '') }}</span>
                <select
                  v-bind="yearSelectProps"
                  :class="cn('h-8 rounded-md border px-2 text-sm', yearSelectProps.class)"
                >
                  <option
                    v-for="option in yearOptions"
                    :key="option.value"
                    :value="String(option.value)"
                    :disabled="option.disabled"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </template>
            <template v-else>
              {{ month.label }}
            </template>
          </div>
          <div v-if="index === 0 && !props.hideNavigation" :class="mergedClassNames.nav">
            <button
              v-bind="prevTriggerProps"
              type="button"
              :class="cn(mergedClassNames.button_previous, prevTriggerProps.class)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              v-bind="nextTriggerProps"
              type="button"
              :class="cn(mergedClassNames.button_next, nextTriggerProps.class)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
        <table v-bind="month.tableProps" :class="calendarGridVariants()">
          <thead v-bind="month.tableHeadProps">
            <tr v-bind="month.tableRowProps">
              <th v-if="props.showWeekNumber" :class="mergedClassNames.week_number" aria-hidden="true">
                #
              </th>
              <th
                v-for="day in weekDays"
                :key="day.short"
                v-bind="month.tableHeaderProps"
                :class="mergedClassNames.weekday"
              >
                {{ day.short }}
              </th>
            </tr>
          </thead>
          <tbody v-bind="month.tableBodyProps">
            <tr v-for="week in month.weeks" :key="week.key" v-bind="month.tableRowProps">
              <th v-if="props.showWeekNumber" :class="mergedClassNames.week_number">
                {{ week.weekNumber }}
              </th>
              <td
                v-for="dayCell in week.days"
                :key="dayCell.key"
                v-bind="dayCell.cellProps"
                :data-selected="
                  dayCell.state.selected || dayCell.state.inRange || undefined
                "
                :data-disabled="
                  !dayCell.state.selectable || undefined
                "
                :data-outside="
                  dayCell.state.outsideRange || undefined
                "
                :class="dayCell.className"
              >
                <button
                  v-bind="dayCell.triggerProps"
                  type="button"
                  :class="cn(mergedClassNames.day_button, getTriggerClass(dayCell.triggerProps))"
                >
                  {{ dayCell.label }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
