Component({
    options: {
        multipleSlots: true
    },
    relations: {
        '../accordion/accordion': {
            type: 'ancestor',
            linked(target) {
                this.parent = target
                if (target.data.api && target.data.api.value) {
                    this.updateFromParent(target.data.api)
                }
            }
        },
        '../accordion-trigger/accordion-trigger': {
            type: 'descendant',
            linked(target) {
                if (this.data.itemApi) target.updateFromItem(this.data.itemApi)
            }
        },
        '../accordion-content/accordion-content': {
            type: 'descendant',
            linked(target) {
                if (this.data.itemApi) target.updateFromItem(this.data.contentApi)
            }
        }
    },
    properties: {
        value: { type: String, value: '' },
        disabled: { type: Boolean, value: false }
    },

    data: {
        itemApi: {} as any,
        contentApi: {} as any
    },

    methods: {
        updateFromParent(parentApi) {
            if (!parentApi || !parentApi.getItemProps) return

            const itemProps = parentApi.getItemProps({ value: this.properties.value, disabled: this.properties.disabled })
            const contentProps = parentApi.getContentProps({ value: this.properties.value, disabled: this.properties.disabled })
            // We also need trigger props but Trigger component will ask for it via relation to Item? 
            // Or Item computes it.
            // Zag separates logic.
            // Let's store the parentApi so children can use it?
            // Or compute all props here.

            this.setData({
                itemApi: itemProps,
                contentApi: contentProps,
                parentApi: parentApi // pass full api reference? data binding might fail if circular or large.
            })

            // Notify trigger/content
            const triggers = this.getRelationNodes('../accordion-trigger/accordion-trigger')
            triggers.forEach(t => t.updateFromItem(parentApi, this.properties.value))

            const contents = this.getRelationNodes('../accordion-content/accordion-content')
            contents.forEach(c => c.updateFromItem(parentApi, this.properties.value))
        }
    }
})
