import { cn } from '@timui/shared'
import { type ClassValue } from 'clsx'

export function resolveClasses(...inputs: ClassValue[]) {
  const merged = cn(...inputs)
  const classes = merged.split(/\s+/)

  const base: string[] = []
  const hover: string[] = []

  classes.forEach((c) => {
    if (!c) return
    if (c.includes('hover:')) {
      // Map `hover:bg-primary/90` -> `hover-bg-primary/90`
      // We also need to sanitize `/` if our CSS script replaced it?
      // My CSS script: css = css.replace(/\\:hover/g, '-hover');
      // It didn't handle `bg-primary/90` slash escaping in the class name itself for replacement.
      // Tailwind output class: `.bg-primary\/90`.
      // CVA output string: `bg-primary/90`.
      // Weapp WXSS: `.bg-primary-90` (if we replaced \/).
      // I need to ensure the JS logic matches the CSS post-processing logic.

      let safeC = c.replace(/:/g, '-').replace(/\//g, '-')
      hover.push(safeC)
    } else {
      let safeC = c.replace(/:/g, '-').replace(/\//g, '-')
      base.push(safeC)
    }
  })

  return {
    baseClass: base.join(' '),
    hoverClass: hover.join(' '),
  }
}
