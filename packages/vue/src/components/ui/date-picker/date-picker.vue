<script setup lang="ts">
import { computed } from "vue";
import type {
  AssertNoExtraKeys,
  DatePickerMode,
  DatePickerRangeValue,
  DatePickerVueProps,
  DatePickerVueValue,
} from "@timui/core";
import {
  cn,
  datePickerContentVariants,
  datePickerRootVariants,
  datePickerTriggerButtonVariants,
  datePickerTriggerIconVariants,
  datePickerTriggerLabelEmptyVariants,
  datePickerTriggerLabelVariants,
  calendarCaptionLabelVariants,
  calendarDayButtonVariants,
  calendarDayVariants,
  calendarGridVariants,
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
  datePickerConnect,
  datePickerMachine,
  buttonVariants,
} from "@timui/core";
import type { VisibleRange } from "@zag-js/date-picker";
import Button from "../button/button.vue";
import { useDatePicker } from "./use-date-picker";

type DatePickerProps = DatePickerVueProps & {
  class?: string;
  triggerClass?: string;
  contentClass?: string;
};

type _DatePickerPropsGuard = AssertNoExtraKeys<
  DatePickerProps,
  DatePickerVueProps & {
    class?: string;
    triggerClass?: string;
    contentClass?: string;
  }
>;

const props = withDefaults(defineProps<DatePickerProps>(), {
  mode: "single",
  placeholder: "Date",
  numberOfMonths: 1,
});

const emit = defineEmits<{
  (e: "update:modelValue", value?: Date | { from?: Date; to?: Date }): void;
  (e: "change", value?: Date | { from?: Date; to?: Date }): void;
}>();

const { api } = useDatePicker(props, emit);

const triggerProps = computed(() => api.value?.getTriggerProps?.() ?? {});
const positionerProps = computed(() => api.value?.getPositionerProps?.() ?? {});
const contentProps = computed(() => api.value?.getContentProps?.() ?? {});

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(
    date
  );

const label = computed(() => {
  const values = api.value?.valueAsDate ?? [];
  if (props.mode === "range") {
    if (!values.length) return "";
    const from = values[0];
    const to = values[1];
    if (from && to) return `${formatDate(from)} - ${formatDate(to)}`;
    if (from) return formatDate(from);
    return "";
  }
  return values[0] ? formatDate(values[0]) : "";
});

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
};

const weekDays = computed(() => api.value?.weekDays ?? []);

const monthData = computed(() => {
  const instance = api.value;
  if (!instance) return [];

  const start = instance.visibleRange?.start;
  if (!start) return [];

  const count = Math.max(1, props.numberOfMonths ?? 1);
  return Array.from({ length: count }, (_, index) => {
    const monthStart = start.add({ months: index });
    const id = `month-${index}`;
    const visibleRange = {
      start: monthStart,
      end: monthStart.add({ months: 1 }).subtract({ days: 1 }),
    } as VisibleRange;
    const weeks = instance.getMonthWeeks(monthStart).map((week, weekIndex) =>
      week.map((day, dayIndex) => {
        const state = instance.getDayTableCellState?.({
          value: day,
          visibleRange,
        }) ?? {};
        const cellProps = instance.getDayTableCellProps?.({
          value: day,
          visibleRange,
        }) ?? {};
        const triggerProps = instance.getDayTableCellTriggerProps?.({
          value: day,
          visibleRange,
        }) ?? {};

        return {
          key: `${id}-${weekIndex}-${dayIndex}-${day.toString()}`,
          label: day.day,
          state,
          cellProps,
          triggerProps,
          className: cn(
            defaultClassNames.day,
            state.outsideRange && defaultClassNames.outside,
            state.firstInRange && defaultClassNames.range_start,
            state.lastInRange && defaultClassNames.range_end,
            state.inRange && !state.firstInRange && !state.lastInRange && defaultClassNames.range_middle,
            state.today && defaultClassNames.today
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
const getTriggerClass = (triggerProps: object) => {
  if (!triggerProps || typeof triggerProps !== "object") return "";
  const className = (triggerProps as { class?: object }).class;
  return typeof className === "string" ? className : "";
};
</script>

<template>
  <div data-slot="date-picker" :class="cn(datePickerRootVariants(), props.class)">
    <Button
      as-child
      variant="outline"
      size="sm"
      :class="cn(datePickerTriggerButtonVariants(), props.triggerClass)"
    >
      <button v-bind="triggerProps">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="datePickerTriggerIconVariants()"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M3 10h18" />
        </svg>
        <span
          :class="
            cn(datePickerTriggerLabelVariants(), !label && datePickerTriggerLabelEmptyVariants())
          "
        >
          {{ label || props.placeholder }}
        </span>
      </button>
    </Button>
    <Teleport to="body">
      <div v-if="api?.open" v-bind="positionerProps" style="z-index: 50">
        <div
          v-bind="contentProps"
          data-slot="date-picker-content"
          :class="cn(datePickerContentVariants(), props.contentClass)"
        >
          <div :class="cn(calendarRootVariants())">
            <div :class="defaultClassNames.months">
              <div
                v-for="(month, index) in monthData"
                :key="month.id"
                :class="defaultClassNames.month"
              >
                <div :class="defaultClassNames.month_caption">
                  <div :class="defaultClassNames.caption_label">
                    {{ month.label }}
                  </div>
                  <div v-if="index === 0" :class="defaultClassNames.nav">
                    <button
                      v-bind="api?.getPrevTriggerProps?.({ view: 'day' })"
                      type="button"
                      :class="defaultClassNames.button_previous"
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
                      v-bind="api?.getNextTriggerProps?.({ view: 'day' })"
                      type="button"
                      :class="defaultClassNames.button_next"
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
                        :class="defaultClassNames.weekday"
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
                          :class="cn(
                            defaultClassNames.day_button,
                            getTriggerClass(dayCell.triggerProps)
                          )"
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
        </div>
      </div>
    </Teleport>
  </div>
</template>
