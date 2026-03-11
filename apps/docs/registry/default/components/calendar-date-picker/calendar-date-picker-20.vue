<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';



</script>

<template>
  <div><div class="rounded-md border"><div class="flex max-sm:flex-col"><div class="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32"><div class="h-full sm:border-e"><div class="flex flex-col px-2"><Button variant="ghost" size="sm" class="w-full justify-start" @click="{
                    setDate(today)
                    setMonth(today)
                  }">Today
                </Button><Button variant="ghost" size="sm" class="w-full justify-start" @click="{
                    setDate(yesterday)
                    setMonth(yesterday)
                  }">Yesterday
                </Button><Button variant="ghost" size="sm" class="w-full justify-start" @click="{
                    setDate(lastWeek)
                    setMonth(lastWeek)
                  }">Last week
                </Button><Button variant="ghost" size="sm" class="w-full justify-start" @click="{
                    setDate(lastMonth)
                    setMonth(lastMonth)
                  }">Last month
                </Button><Button variant="ghost" size="sm" class="w-full justify-start" @click="{
                    setDate(lastYear)
                    setMonth(lastYear)
                  }">Last year
                </Button></div></div></div><Calendar mode="single" :selected="date" :onSelect="(newDate) => {
              if (newDate) {
                setDate(newDate)
              }
            }" :month="month" :onMonthChange="setMonth" class="p-2" :disabled="[
              { after: today }, // Dates before today
            ]" /></div></div><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Calendar with presets -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
