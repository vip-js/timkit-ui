import type { RegistryItem } from '@timui/core'

import { buildComponentApiModel } from '@/lib/component-api'
import { ApiTable } from '@/components/api-table'
import type { ComponentData } from '@/components/preview/preview-app'

type ComponentApiReferenceProps = {
  slug: string
  sectionComponents: ComponentData[]
  registryItem?: RegistryItem
}

const Badge = ({ label }: { label: string }) => (
  <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
    {label}
  </span>
)

export function ComponentApiReference({
  slug,
  sectionComponents,
  registryItem,
}: ComponentApiReferenceProps) {
  const api = buildComponentApiModel(slug, sectionComponents, registryItem)

  if (!api.schema) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground">
        Structured API schema is not available for this component yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Component
          </p>
          <p className="mt-1 font-mono text-sm text-foreground">{api.schema.name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Logic
          </p>
          <p className="mt-1 text-sm text-foreground">
            {api.schema.logic.provider}
            {api.schema.logic.machine ? ` / ${api.schema.logic.machine}` : ''}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Runtime Frameworks
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {api.frameworkLabels.length ? (
              api.frameworkLabels.map((framework) => <Badge key={framework} label={framework} />)
            ) : (
              <span className="text-sm text-muted-foreground">Not declared</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Supported Platforms
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {api.platformLabels.length ? (
              api.platformLabels.map((platform) => <Badge key={platform} label={platform} />)
            ) : (
              <span className="text-sm text-muted-foreground">Not declared</span>
            )}
          </div>
        </div>
      </div>

      <ApiTable title="Configuration" data={api.configs} />
      <ApiTable title="Props" data={api.props} />
      <ApiTable title="Events" data={api.events} />
      <ApiTable title="Slots" data={api.slots} />
      <ApiTable title="Parts" data={api.parts} />

      {!!api.schema.variants?.length && (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Variants
          </p>
          <div className="mt-3 space-y-3">
            {api.schema.variants.map((variant) => (
              <div
                key={variant.name}
                className="rounded-xl border border-border/50 bg-background/70 p-3"
              >
                <p className="text-sm font-medium text-foreground">
                  {variant.prop}
                  {variant.defaultOption ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      default: {variant.defaultOption}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{variant.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <Badge key={option.name} label={option.name} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!!api.schema.interactions?.length && (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Interaction States
          </p>
          <div className="mt-3 space-y-3">
            {api.schema.interactions.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-border/50 bg-background/70 p-3"
              >
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.states.map((state) => (
                    <Badge key={state} label={state} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-xs text-muted-foreground">
        This API reference is generated from `/packages/core` component schemas to keep
        React/Vue/Weapp docs consistent.
        {api.usedInference
          ? ' Some entries are inferred from props contracts to keep API complete.'
          : ''}
      </div>
    </div>
  )
}
