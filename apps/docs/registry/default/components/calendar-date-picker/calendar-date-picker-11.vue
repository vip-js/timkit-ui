<script setup lang="ts">
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



</script>

<template>
  <div><Calendar mode="single" :selected="date" :onSelect="setDate" class="rounded-md border p-2" :classNames="{
          month_caption: 'mx-0',
        }" captionLayout="dropdown" :defaultMonth="new Date()" :startMonth="new Date(1980, 6)" hideNavigation :components="{
          DropdownNav: (props: DropdownNavProps) => {
            return <div className="flex w-full items-center gap-2">{props.children}</div>
          },
          Dropdown: (props: DropdownProps) => {
            return (
              <Select
                value={String(props.value)}
                onValueChange={(value: string) => {
                  if (props.onChange) {
                    handleCalendarChange(value, props.onChange)
                  }
                }}
              >
                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                  {props.options?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={String(option.value)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          },
        }" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Monthly / yearly selects -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
