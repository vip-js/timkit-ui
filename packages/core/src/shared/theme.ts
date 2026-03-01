/**
 * Theme Engine
 * 
 * 统一管理设计变量，并导出为不同平台的格式。
 */

export interface ThemeTokens {
    colors: Record<string, string>
    spacing: Record<string, string>
    radius: Record<string, string>
}

export const defaultTokens: ThemeTokens = {
    colors: {
        primary: 'hsl(222.2 47.4% 11.2%)',
        'primary-foreground': 'hsl(210 40% 98%)',
        secondary: 'hsl(210 40% 96.1%)',
        'secondary-foreground': 'hsl(222.2 47.4% 11.2%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        'destructive-foreground': 'hsl(210 40% 98%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(222.2 84% 4.9%)',
    },
    spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '4': '1rem',
    },
    radius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
    }
}

export function toCssVars(tokens: ThemeTokens = defaultTokens): string {
    let css = ':root {\n'
    for (const [key, value] of Object.entries(tokens.colors)) {
        css += `  --${key}: ${value};\n`
    }
    css += '  --radius: 0.5rem;\n'
    css += '}\n'
    return css
}

export function toWxssVars(tokens: ThemeTokens = defaultTokens): string {
    let wxss = 'page {\n'
    for (const [key, value] of Object.entries(tokens.colors)) {
        // 微信小程序中 hsl 兼容性较好，但有时需要转换为 hex/rgb
        wxss += `  --${key}: ${value};\n`
    }
    wxss += '  --radius: 8rpx;\n'
    wxss += '}\n'
    return wxss
}
