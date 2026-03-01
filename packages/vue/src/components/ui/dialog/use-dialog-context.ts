import { createContext } from "../../../hooks/create-context"
import type { dialogConnect } from "@timui/core"
import type { ComputedRef } from "vue"

export type DialogContext = ComputedRef<ReturnType<typeof dialogConnect>>

export const [DialogProvider, useDialogContext] = createContext<DialogContext>({
    id: "DialogContext",
    providerName: "<Dialog />",
})
