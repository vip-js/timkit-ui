import type { ComponentSchema } from "./index"

const toggleSchema: ComponentSchema = {
    name: "toggle",
    title: "Toggle",
    description: "A two-state button that can be either on or off.",
    props: [
        {
            name: "variant",
            type: "enum",
            description: "The visual style of the toggle.",
            values: ["default", "outline"],
            defaultValue: "default",
        },
        {
            name: "size",
            type: "enum",
            description: "The size of the toggle.",
            values: ["default", "sm", "lg"],
            defaultValue: "default",
        },
        {
            name: "pressed",
            type: "boolean",
            description: "The controlled pressed state of the toggle.",
            defaultValue: false,
        },
        {
            name: "onPressedChange",
            type: "event",
            description: "Event handler called when the pressed state changes.",
        },
    ],
    slots: [
        {
            name: "default",
            description: "The content of the toggle.",
            required: true,
        },
    ],
    variants: [
        {
            name: "variant",
            prop: "variant",
            description: "Visual style of the toggle.",
            options: [
                {
                    name: "default",
                    description: "Default toggle style.",
                },
                {
                    name: "outline",
                    description: "Outline toggle style.",
                },
            ],
            defaultOption: "default",
        },
        {
            name: "size",
            prop: "size",
            description: "Size of the toggle.",
            options: [
                {
                    name: "default",
                    description: "Default size.",
                },
                {
                    name: "sm",
                    description: "Small size.",
                },
                {
                    name: "lg",
                    description: "Large size.",
                },
            ],
            defaultOption: "default",
        },
    ],
    supportedPlatforms: ["web", "wechat"],
}

export default toggleSchema
