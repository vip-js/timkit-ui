export const palette = {
    white: "oklch(1 0 0)",
    black: "oklch(0 0 0)",
    zinc: {
        50: "oklch(0.985 0 0)",
        100: "oklch(0.97 0 0)",
        200: "oklch(0.922 0 0)",
        300: "oklch(0.87 0 0)",
        400: "oklch(0.708 0 0)",
        500: "oklch(0.556 0 0)",
        600: "oklch(0.439 0 0)",
        700: "oklch(0.371 0 0)",
        800: "oklch(0.269 0 0)",
        900: "oklch(0.205 0 0)",
        950: "oklch(0.145 0 0)",
    },
    // Add other colors as needed
} as const

export const semantic = {
    background: {
        default: palette.white,
        subtle: palette.zinc[50],
        overlay: palette.white, // In dark mode this would change
    },
    foreground: {
        default: palette.zinc[950],
        muted: palette.zinc[500],
        inverted: palette.white,
    },
    primary: {
        DEFAULT: palette.zinc[900],
        foreground: palette.zinc[50],
    },
    secondary: {
        DEFAULT: palette.zinc[100],
        foreground: palette.zinc[900],
    },
    destructive: {
        DEFAULT: "oklch(0.637 0.237 25.331)",
        foreground: palette.white,
    },
    border: {
        default: palette.zinc[200],
        input: palette.zinc[200],
    },
    radius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.625rem",
        full: "9999px",
    },
} as const

export const tokens = {
    palette,
    semantic,
}

export type Tokens = typeof tokens
