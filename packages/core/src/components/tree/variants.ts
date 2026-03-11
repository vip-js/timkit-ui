import { cva } from 'class-variance-authority'

export const treeVariants = cva('flex flex-col')
export const treeItemVariants = cva(
  'z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
export const treeItemLabelVariants = cva(
  'in-focus-visible:ring-ring/50 bg-background hover:bg-accent in-data-[selected=true]:bg-accent in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] in-data-[search-match=true]:bg-blue-50! [&_svg]:pointer-events-none [&_svg]:shrink-0'
)
export const treeItemLabelIconVariants = cva(
  'text-muted-foreground size-4 in-aria-[expanded=false]:-rotate-90'
)
export const treeDragLineVariants = cva(
  'bg-primary before:bg-background before:border-primary absolute z-30 -mt-px h-0.5 w-[unset] before:absolute before:-top-[3px] before:left-0 before:size-2 before:rounded-full before:border-2'
)
