<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as datePicker from "@zag-js/date-picker";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { getLocalTimeZone, type DateValue } from "@internationalized/date";

// Simple button variants inlined
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'default',
    },
  }
)

const calendarVariants = cva('p-3')
const calendarRootVariants = cva('w-fit')
const calendarMonthsVariants = cva('relative flex flex-col sm:flex-row gap-4')
const calendarMonthVariants = cva('w-full')
const calendarMonthCaptionVariants = cva('relative mx-10 mb-1 flex h-9 items-center justify-center z-20')
const calendarCaptionLabelVariants = cva('text-sm font-medium')
const calendarNavVariants = cva('absolute top-0 flex w-full justify-between z-10')
const calendarNavButtonVariants = cva('size-9 text-muted-foreground/80 hover:text-foreground p-0')
const calendarWeekdayVariants = cva('size-9 p-0 text-xs font-medium text-muted-foreground/80')
const calendarDayButtonVariants = cva(
    'relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 group-data-disabled:pointer-events-none focus-visible:z-10 hover:not-in-data-selected:bg-accent group-data-selected:bg-primary hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground group-data-disabled:text-foreground/30 group-data-disabled:line-through group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-[.range-middle]:group-data-selected:bg-accent group-[.range-middle]:group-data-selected:text-foreground'
)
const calendarDayVariants = cva('group size-9 px-0 py-px text-sm')
const calendarOutsideVariants = cva('text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground')
const calendarGridVariants = cva('w-full border-collapse space-y-1')

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class'];
  modelValue?: DateValue | DateValue[];
  mode?: "single" | "multiple" | "range";
  numberOfMonths?: number;
}>(), {
  mode: "single",
  numberOfMonths: 1,
});

const emit = defineEmits(["update:modelValue", "change"]);

const context = computed(() => ({
  id: "calendar",
  inline: true,
  selectionMode: props.mode,
  numOfMonths: props.numberOfMonths,
  value: props.modelValue ? (Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]) : undefined,
  onValueChange: (details: any) => {
    const val = details.value;
    emit("update:modelValue", props.mode === 'single' ? val[0] : val);
    emit("change", props.mode === 'single' ? val[0] : val);
  }
}));

const service = useMachine(datePicker.machine, context);
const api = computed(() => datePicker.connect(service, normalizeProps));

const monthData = computed(() => {
  const instance = api.value;
  if (!instance.visibleRange) return [];
  const start = instance.visibleRange.start;
  return Array.from({ length: props.numberOfMonths }, (_, i) => {
    const month = start.add({ months: i });
    return {
      id: `month-${i}`,
      label: instance.format(month, { month: "long", year: "numeric" }),
      weeks: instance.getMonthWeeks(month),
      visibleRange: { start: month, end: month.add({ months: 1 }).subtract({ days: 1 }) }
    };
  });
});
</script>

<template>
  <div v-bind="api.getRootProps()" :class="cn(calendarRootVariants(), props.class)">
    <div :class="calendarMonthsVariants()">
      <div v-for="(month, index) in monthData" :key="month.id" :class="calendarMonthVariants()">
        <div :class="calendarMonthCaptionVariants()">
          <div :class="calendarCaptionLabelVariants()">{{ month.label }}</div>
          <div v-if="index === 0" :class="calendarNavVariants()">
             <button v-bind="api.getPrevTriggerProps({ view: 'day' })" :class="cn(buttonVariants({ variant: 'ghost' }), calendarNavButtonVariants())">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
             </button>
             <button v-bind="api.getNextTriggerProps({ view: 'day' })" :class="cn(buttonVariants({ variant: 'ghost' }), calendarNavButtonVariants())">
               <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
             </button>
          </div>
        </div>
        
        <table v-bind="api.getTableProps({ view: 'day', id: month.id })" :class="calendarGridVariants()">
          <thead v-bind="api.getTableHeadProps({ view: 'day', id: month.id })">
            <tr v-bind="api.getTableRowProps({ view: 'day', id: month.id })">
              <th v-for="day in api.weekDays" :key="day.short" :class="calendarWeekdayVariants()">
                {{ day.short }}
              </th>
            </tr>
          </thead>
          <tbody v-bind="api.getTableBodyProps({ view: 'day', id: month.id })">
            <tr v-for="(week, wIndex) in month.weeks" :key="wIndex" v-bind="api.getTableRowProps({ view: 'day', id: month.id })">
              <td v-for="day in week" :key="day.toString()" v-bind="api.getDayTableCellProps({ value: day, visibleRange: month.visibleRange })"
                  :class="cn(
                    calendarDayVariants(),
                    api.getDayTableCellState({ value: day, visibleRange: month.visibleRange }).outsideRange && calendarOutsideVariants(),
                  )">
                  <button type="button" v-bind="api.getDayTableCellTriggerProps({ value: day, visibleRange: month.visibleRange })"
                          :class="cn(calendarDayButtonVariants())">
                    {{ day.day }}
                  </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
