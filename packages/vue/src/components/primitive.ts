import { cloneVNode, defineComponent, h, type Component, type PropType } from 'vue'

export type PrimitiveProps = {
  as?: string | Component
  asChild?: boolean
}

export const Primitive = defineComponent({
  name: 'Primitive',
  props: {
    as: {
      type: [String, Object, Function] as PropType<string | Component>,
      default: 'div',
    },
    asChild: {
      type: Boolean,
      default: false,
    },
  },
  inheritAttrs: false,
  setup(props, { attrs, slots }) {
    return () => {
      const children = slots.default?.()

      if (props.asChild && children && children.length === 1) {
        return cloneVNode(children[0], { ...attrs, ...(children[0].props || {}) })
      }

      return h(props.as, attrs, children)
    }
  },
})
