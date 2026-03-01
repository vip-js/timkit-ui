<script setup lang="ts">
import { computed } from "vue";
import type {
  AssertNoExtraKeys,
  CalendarMode,
  CalendarRangeValue,
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
  calendarWeekdayVariants,
  calendarConnect,
  calendarMachine,
  cn,
  buttonVariants,
} from "@timui/core";
import type { VisibleRange } from "@zag-js/date-picker";
import { useCalendar, type UseCalendarProps } from "./use-calendar";

type CalendarProps = CalendarVueProps & {
  class?: string;
  classNames?: Partial<Record<string, string>>;
};

type _CalendarPropsGuard = AssertNoExtraKeys<
  CalendarProps,
  CalendarVueProps & {
    class?: string;
    classNames?: Partial<Record<string, string>>;
  }
>;

const props = withDefaults(defineProps<CalendarProps>(), {
  mode: "single",
  showOutsideDays: true,
  numberOfMonths: 1,
});

const emit = defineEmits<{
  (e: "update:modelValue", value?: Date | { from?: Date; to?: Date }): void;
  (e: "change", value?: Date | { from?: Date; to?: Date }): void;
}>();

const { api } = useCalendar(props, emit);

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
    const weeks = instance.getMonthWeeks(monthStart).map((week, weekIndex) =>
      week.map((day, dayIndex) => {
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
      })
    );

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
            {{ month.label }}
          </div>
          <div v-if="index === 0" :class="mergedClassNames.nav">
            <button
              v-bind="prevTriggerProps"
              type="button"
              :class="mergedClassNames.button_previous"
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
              :class="mergedClassNames.button_next"
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
            <tr v-for="(week, weekIndex) in month.weeks" :key="weekIndex" v-bind="month.tableRowProps">
              <td
                v-for="dayCell in week"
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
