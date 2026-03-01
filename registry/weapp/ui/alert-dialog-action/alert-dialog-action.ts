Component({
    relations: {
        '../alert-dialog/alert-dialog': { type: 'ancestor' }
    },
    data: {
        // Action usually closes dialog too, so we can use closeTriggerProps or custom logic.
        // In Shadcn, Action is just a styled button.
        // Logic should be handled by user tap event + api.close if needed?
        // Not necessarily. 
        // Usually it confirms.
    }
})
