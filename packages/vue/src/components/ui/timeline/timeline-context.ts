import { createContext } from "radix-vue";
import type { Ref } from "vue";

export interface TimelineContextValue {
    activeStep: Ref<number>;
    setActiveStep: (step: number) => void;
    orientation: Ref<"horizontal" | "vertical">;
}

export const [injectTimelineContext, provideTimelineContext] =
    createContext<TimelineContextValue>("Timeline");
