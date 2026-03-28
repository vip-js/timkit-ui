type AttributeValue = string | number | boolean | undefined | Component

type Attributes = Record<string, AttributeValue>

type VNode = {
  props?: Attributes
  children?: VNode[]
}

type Component = (props?: Attributes) => VNode | null

interface HTMLAttributes extends Attributes {}

const defineComponent = <T>(options: T): T => options

const h = (
  component: string | Component,
  attrs?: Attributes,
  children?: VNode[] | VNode
): VNode => {
  const normalizedChildren = Array.isArray(children) ? children : children ? [children] : undefined
  return { props: attrs, children: normalizedChildren }
}

const cloneVNode = (node: VNode, props?: Attributes): VNode => ({
  ...node,
  props: { ...node.props, ...props },
})

export interface PrimitiveProps extends HTMLAttributes {
  as?: string | Component
  asChild?: boolean
}

export const Primitive = defineComponent({
  name: 'Primitive',
  props: {
    as: {
      type: [String, Object, Function],
      default: 'div',
    },
    asChild: {
      type: Boolean,
      default: false,
    },
  },
  inheritAttrs: false,
  setup(
    props: PrimitiveProps,
    { attrs, slots }: { attrs: HTMLAttributes; slots: { default?: () => VNode[] } }
  ) {
    return () => {
      const children = slots.default?.()

      if (props.asChild && children && children.length === 1) {
        return cloneVNode(children[0], { ...(children[0].props ?? {}), ...attrs })
      }

      const component = props.as ?? 'div'
      return h(component, attrs, children)
    }
  },
})
