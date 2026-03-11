<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleContent } from '@/components/ui/collapsible-content';
import { CollapsibleTrigger } from '@/components/ui/collapsible-trigger';
import { ScrollArea } from '@/components/ui/scroll-area';



</script>

<template>
  <div><Calendar mode="single" :selected="date" :onSelect="setDate" :month="month" :onMonthChange="setMonth" :defaultMonth="new Date()" :startMonth="startDate" :endMonth="endDate" class="overflow-hidden rounded-md border p-2" :classNames="{
          month_caption: 'ms-2.5 me-20 justify-start',
          nav: 'justify-end',
        }" :components="{
          CaptionLabel: (props: CaptionLabelProps) => (
            <CaptionLabel isYearView={isYearView} setIsYearView={setIsYearView} {...props} />
          ),
          MonthGrid: (props: MonthGridProps) => {
            return (
              <MonthGrid
                className={props.className}
                isYearView={isYearView}
                setIsYearView={setIsYearView}
                startDate={startDate}
                endDate={endDate}
                years={years}
                currentYear={month.getFullYear()}
                currentMonth={month.getMonth()}
                onMonthSelect={(selectedMonth: Date) => {
                  setMonth(selectedMonth)
                  setIsYearView(false)
                }}
              >
                {props.children}
              </MonthGrid>
            )
          },
        }" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Advanced selection -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
