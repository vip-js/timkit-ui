Component({
    relations: {
        '../dropdown-menu/dropdown-menu': { type: 'ancestor' }
    },
    data: {
        labelApi: {} as any // wrapper usually
    },
    methods: {
        updateFromParent(parentApi) {
            // Label is mostly static styling in Zag, api might have separators logic but label is simple div usually?
            // Zag doesn't strictly manage label props in `connect`?
            // We can just style it.
        }
    }
})
