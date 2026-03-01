'use client'

import * as React from 'react'

import { cn } from '../lib/utils'
import { Checkbox } from './checkbox' // Assuming existing Checkbox uses Zag or similar

// Simple recursive tree node interface
export interface TreeNode {
    id: string
    label: string
    children?: TreeNode[]
    icon?: React.ReactNode
}

interface CheckboxTreeProps {
    data: TreeNode[]
    checked?: string[]
    onCheckedChange?: (checked: string[]) => void
    expanded?: string[]
    onExpandedChange?: (expanded: string[]) => void
    className?: string
}

export function CheckboxTree({
    data,
    checked = [],
    onCheckedChange,
    expanded = [],
    onExpandedChange,
    className
}: CheckboxTreeProps) {
    const [internalExpanded, setInternalExpanded] = React.useState<string[]>(expanded)
    const isExpandedControlled = expanded !== undefined && onExpandedChange !== undefined

    const currentExpanded = isExpandedControlled ? expanded : internalExpanded

    const handleToggleExpand = (id: string) => {
        const next = currentExpanded.includes(id)
            ? currentExpanded.filter(e => e !== id)
            : [...currentExpanded, id]

        if (isExpandedControlled) {
            onExpandedChange?.(next)
        } else {
            setInternalExpanded(next)
        }
    }

    const [internalChecked, setInternalChecked] = React.useState<string[]>(checked)
    const isCheckedControlled = checked !== undefined && onCheckedChange !== undefined

    const currentChecked = isCheckedControlled ? checked : internalChecked

    // Helper to get all descendant IDs
    const getDescendants = (node: TreeNode): string[] => {
        let ids: string[] = []
        if (node.children) {
            node.children.forEach(child => {
                ids.push(child.id)
                ids = [...ids, ...getDescendants(child)]
            })
        }
        return ids
    }

    const handleCheck = (node: TreeNode, isChecked: boolean) => {
        let newChecked: string[] = []
        if (isChecked) {
            // Add node and all descendants
            const descendants = getDescendants(node)
            newChecked = Array.from(new Set([...currentChecked, node.id, ...descendants]))
        } else {
            // Remove node and all descendants
            const descendants = getDescendants(node)
            newChecked = currentChecked.filter(id => id !== node.id && !descendants.includes(id))
        }

        // Also need to handle parent checking logic (classic tree checkbox logic)
        // If all siblings checked -> check parent
        // If some siblings checked -> indeterminate parent (handled by UI usually)
        // If no siblings checked -> uncheck parent
        // This requires traversing up.
        // For simplicity here, we implement "check down" only, or assume flat selection.
        // But "Checkbox Tree" implies hierarchical selection.

        // Re-evaluating hierarchical selection from scratch is complex.
        // Let's implement a simple version where checking a parent checks children.

        if (isCheckedControlled) {
            onCheckedChange?.(newChecked)
        } else {
            setInternalChecked(newChecked)
        }
    }

    // Helper to determine node state: checked, indeterminate, unchecked
    const getNodeState = (node: TreeNode): 'checked' | 'indeterminate' | 'unchecked' => {
        if (currentChecked.includes(node.id)) return 'checked'
        if (!node.children || node.children.length === 0) return 'unchecked'

        const descendants = getDescendants(node)
        const checkedDescendants = descendants.filter(id => currentChecked.includes(id))

        if (checkedDescendants.length === descendants.length && descendants.length > 0) {
            return 'checked'
        }
        if (checkedDescendants.length > 0) {
            return 'indeterminate'
        }
        return 'unchecked'
    }

    const renderNode = (node: TreeNode, level: number = 0) => {
        const hasChildren = node.children && node.children.length > 0
        const isExpanded = currentExpanded.includes(node.id)
        const state = getNodeState(node)

        return (
            <div key={node.id} className={cn("select-none", level > 0 && "ml-4")}>
                <div className="flex items-center py-1 group">
                    <button
                        type="button"
                        onClick={() => hasChildren && handleToggleExpand(node.id)}
                        className={cn(
                            "p-0.5 mr-1 h-4 w-4 text-muted-foreground hover:text-foreground transition-transform",
                            !hasChildren && "invisible"
                        )}
                    >
                        {isExpanded
                            ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                        }
                    </button>

                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => handleCheck(node, state !== 'checked')}
                    >
                        <div
                            className={cn(
                                "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                                state === 'checked' ? "bg-primary text-primary-foreground" : "",
                                state === 'indeterminate' ? "bg-primary text-primary-foreground opacity-50" : ""
                            )}
                        >
                            <span className="flex items-center justify-center text-current h-full w-full">
                                {state === 'checked' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>}
                                {state === 'indeterminate' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true"><path d="M5 12h14" /></svg>}
                            </span>
                        </div>
                        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {node.label}
                        </span>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="border-l border-border ml-2 pl-2">
                        {node.children!.map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={cn("w-full", className)}>
            {data.map(node => renderNode(node))}
        </div>
    )
}
