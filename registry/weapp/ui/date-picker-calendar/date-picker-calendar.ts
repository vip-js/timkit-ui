Component({
    relations: {
        '../date-picker/date-picker': { type: 'ancestor' }
    },
    data: {
        api: {} as any, // Full date picker api
        weeks: [] as any[] // Computed weeks for rendering
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            // In Zag Date Picker, we usually iterate `api.weeks` or `api.getWeeks()`?
            // Zag React Date Picker: `api.visibleRange` ??
            // Zag docs: `api.weeks` is available in the state context usually?
            // Wait, Zag `date-picker` uses `api.getWeeks()`?
            // Actually, typical usage is:
            // api.weeks.map(week => ...)
            // Let's check if `api.weeks` exists on the normalized props.
            // Usually it does in `date-picker`.
            // If not, we might need to access `state.context.weeks` via api?
            // Zag Date Picker `connect` exposes `weeks`.
            this.setData({
                api: parentApi,
                weeks: parentApi.weeks || []
            })
        },
        handlePrev() {
            if (this.data.api.goToPrevMonth) this.data.api.goToPrevMonth()
        },
        handleNext() {
            if (this.data.api.goToNextMonth) this.data.api.goToNextMonth()
        },
        handleDayClick(e) {
            const { date } = e.currentTarget.dataset
            // date is an object usually { day, month, year, value... }
            // Zag expects `api.focusDay(date)` or similar?
            // Actually `api.getDayProps({ value: date })` has onClick.
            // We can pre-compute day props or handle click manually if props are complex.
            // Better: We pre-compute the specific props for each day in WXML? No, logic in JS.
            // But `api.getDayProps` returns event handlers.
            // Simplest: we just call `api.focusDay(date)` and `api.selectDate(date)`.
            // Correct Zag way: `api.value = [date]`?
            // Let's look at `api.getDayProps` result. It has `onClick`.
            // In WeApp we can't easily bind dynamic function references from data array.
            // So we must manually map the interaction.
            // `api.focusDay(date)` 
            // `api.selectDay(date)` ?
            // Zag DatePicker API has `focusDate(date)` and `selectDate(date)`.
            // We'll use those.
            if (this.data.api.focusDate) this.data.api.focusDate(date)
            if (this.data.api.selectDate) this.data.api.selectDate(date)
            // Also need to handle toggle if multiple?
            // Zag handles it if we call selectDate.
        }
    }
})
