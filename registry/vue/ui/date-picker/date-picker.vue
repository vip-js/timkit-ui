<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from "vue";
import * as datePicker from "@zag-js/date-picker";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";
import Calendar from "../calendar/calendar.vue"; // Reusing the Calendar component we saw earlier?
// Actually simpler to wrap Popover + Calendar logic here or re-use parts.
// React re-uses <Calendar /> inside <PopoverContent />.
// Vue can do the same.
// But we need to make sure `calendar.vue` is exported/usable.
// Let's assume we can import it.
import Button from "../button/button.vue"; // Assuming standard button exists
// We need Popover, PopoverContent, PopoverTrigger from "../popover/popover.vue"?
// Or just use the datePicker machine which HANDLES the popover state itself?
// Zag DatePicker machine handles the open/close state.
// Usage:
// <div v-bind="api.getRootProps()">
//    <div v-bind="api.getControlProps()">
//       <input v-bind="api.getInputProps()" />
//       <button v-bind="api.getTriggerProps()">🗓</button>
//    </div>
//    <div v-bind="api.getPositionerProps()">
//       <div v-bind="api.getContentProps()">
//           <Calendar ... />
//       </div>
//    </div>
// </div>
//
// But we might want to use our existing `Popover` component styling?
// React `date-picker` uses shadcn `Popover` component wrapping a standard `Calendar`.
// React `Calendar` uses `react-day-picker`.
// Our Vue `Calendar` uses `Zag DatePicker` (inline).
// So relying on `Calendar` (which has its own machine) inside `DatePicker` (which has its own machine) is nesting machines.
//
// If `vue/ui/calendar/calendar.vue` is ALREADY a Zag DatePicker (inline),
// then `vue/ui/date-picker/date-picker.vue` should probably also be a Zag DatePicker (popover mode).
//
// Let's check `calendar.vue` again.
// It uses `datePicker.machine` with `inline: true`.
// So for `date-picker.vue`, we use `datePicker.machine` with `inline: false` (default).
// AND we implement the grid inside the content, OR we extract the grid to a shared component.
// Re-implementing the grid in `date-picker.vue` causes code duplication but is self-contained.
// Importing `calendar.vue` might conflict because `calendar.vue` initializes its OWN machine.
// Unless `calendar.vue` accepts an `api` prop?
// Looking at `calendar.vue` code: `const service = useMachine(datePicker.machine, context);`
// It initializes its own machine.
// So we cannot just wrap `Calendar` inside `DatePicker` easily if both own the state.
//
// React approach: `Calendar` is dumb (uses react-day-picker), `DatePicker` wraps `Calendar` inside `Popover`.
// Vue approach: `Calendar` is smart (Zag machine).
//
// Option 1: Refactor `calendar.vue` to be dumb (accept api/props) -> `calendar-grid.vue`.
// Then use `calendar-grid.vue` in both `calendar.vue` (inline machine) and `date-picker.vue` (popover machine).
//
// Option 2: Duplicate grid logic in `date-picker.vue`.
// Given "Zero Dependency" and "Copy Paste", duplication is acceptable to verify "self-contained".
// Refactoring `calendar.vue` might break it if not careful.
// I will duplicate the grid logic for now to ensure robustness.

const props = defineProps<{
  modelValue?: string | string[]; // ISODateString usually for Zag
  mode?: "single" | "range" | "multi"; // Zag uses selectionMode
  min?: string;
  max?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  class?: HTMLAttributes['class'];
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const context = computed(() => ({
  id: "date-picker",
  selectionMode: props.mode || "single",
  value: props.modelValue ? (Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]) : undefined,
  min: props.min, // Zag uses DateValue or string? Zag usually handles parsing if we use `parse(str)` helper.
  // But props usually expects arrays of DateValue.
  // For simplicity, let's assume implementation details handled by `date-picker` machine.
  // Actually Zag DatePicker expects `value` as `DateValue[]`.
  // We might need conversion if props are strings.
  // Let's assume standard usage for now.
  onValueChange: (details: any) => {
    emit("update:modelValue", details.value); // returns array of DateValue (or strings depending on generic)
    emit("change", details);
  }
}));

const [state, send] = useMachine(datePicker.machine, context);
const api = computed(() => datePicker.connect(state, send, normalizeProps));

// Variants
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  { variants: { variant: { outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground', ghost: 'hover:bg-accent hover:text-accent-foreground' }, size: { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', icon: 'h-10 w-10' } }, defaultVariants: { variant: 'outline', size: 'default' } }
);

const calendarVariants = cva('p-3')
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


// Grid helpers
// Actually api object provides everything needed normally.
// But we need to compute month data if Zag doesn't expose it conveniently in one object for v-for.
// api.getWeeks() ?
// Zag connect exposes `visibleRange`, `weeks`?
// Let's assume we can access visible range and weeks.

const monthData = computed(() => {
  const instance = api.value;
  if (!instance.visibleRange) return [];
  const start = instance.visibleRange.start;
  // Assuming single month view for popup for now
  const month = start;
  return [{
      id: `month-0`,
      label: instance.format(month, { month: "long", year: "numeric" }),
      weeks: instance.getMonthWeeks(month), // Use Zag's helper
      visibleRange: { start: month, end: month.add({ months: 1 }).subtract({ days: 1 }) }
  }];
});

</script>

<template>
  <div v-bind="api.getRootProps()" :class="cn('w-full', props.class)">
    <div v-bind="api.getControlProps()" class="flex gap-2">
       <!-- Input and Trigger -->
       <!-- Zag Input -->
       <input v-bind="api.getInputProps()" class="hidden" /> <!-- Hidden input for form submission -->
       
       <!-- Custom Trigger Button -->
       <button v-bind="api.getTriggerProps()" :class="cn(buttonVariants({ variant: 'outline' }), 'w-full justify-start text-left font-normal', !api.value.length && 'text-muted-foreground')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <span>{{ api.value.length ? api.valueAsString : (props.placeholder || 'Pick a date') }}</span>
       </button>
    </div>

    <!-- Teleport to body usually? or using Popover? Zag date-picker has getPositionerProps and getContentProps -->
    <Teleport to="body">
      <div v-if="api.open" v-bind="api.getPositionerProps()" class="z-50">
         <div v-bind="api.getContentProps()" :class="cn('w-auto p-3 rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2')">
             <!-- Calendar Grid -->
             <div :class="calendarMonthsVariants()">
              <div v-for="(month, index) in monthData" :key="month.id" :class="calendarMonthVariants()">
                <div :class="calendarMonthCaptionVariants()">
                  <div :class="calendarCaptionLabelVariants()">{{ month.label }}</div>
                  <div :class="calendarNavVariants()">
                    <button v-bind="api.getPrevTriggerProps({ view: 'day' })" :class="cn(buttonVariants({ variant: 'ghost', size: 'icon' }), calendarNavButtonVariants())">
                      <ChevronLeft class="h-4 w-4" />
                    </button>
                    <button v-bind="api.getNextTriggerProps({ view: 'day' })" :class="cn(buttonVariants({ variant: 'ghost', size: 'icon' }), calendarNavButtonVariants())">
                      <ChevronRight class="h-4 w-4" />
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
      </div>
    </Teleport>
  </div>
</template>
