import { a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Theming", href: "/docs/theming" }
    ]
  },
  {
    title: "Components",
    items: [
      { title: "Accordion", href: "/docs/components/accordion" },
      { title: "Alert", href: "/docs/components/alert" },
      { title: "Alert Dialog", href: "/docs/components/alert-dialog" },
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "Badge", href: "/docs/components/badge" },
      { title: "Button", href: "/docs/components/button" },
      { title: "Card", href: "/docs/components/card" },
      { title: "Checkbox", href: "/docs/components/checkbox" },
      { title: "Collapsible", href: "/docs/components/collapsible" },
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Dropdown Menu", href: "/docs/components/dropdown-menu" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Label", href: "/docs/components/label" },
      { title: "Pagination", href: "/docs/components/pagination" },
      { title: "Popover", href: "/docs/components/popover" },
      { title: "Progress", href: "/docs/components/progress" },
      { title: "Radio Group", href: "/docs/components/radio-group" },
      { title: "Select", href: "/docs/components/select" },
      { title: "Separator", href: "/docs/components/separator" },
      { title: "Slider", href: "/docs/components/slider" },
      { title: "Switch", href: "/docs/components/switch" },
      { title: "Tabs", href: "/docs/components/tabs" },
      { title: "Textarea", href: "/docs/components/textarea" },
      { title: "Toast", href: "/docs/components/toast" },
      { title: "Toggle", href: "/docs/components/toggle" },
      { title: "Tooltip", href: "/docs/components/tooltip" }
    ]
  }
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "docs-container page-block" }, _attrs))}><section class="hero"><div class="hero-badge">Design system for teams that ship fast</div><h1 class="hero-title">TimUI for Vue</h1><p class="hero-subtitle"> A precise, composable component library powered by Zag.js. Built for clarity, speed, and linear\u2011grade polish. </p><div class="hero-actions">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/docs/components/button",
        class: "btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Browse Components`);
          } else {
            return [
              createTextVNode("Browse Components")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/docs/components/alert",
        class: "btn-secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Start With Alert`);
          } else {
            return [
              createTextVNode("Start With Alert")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hero-stats"><div class="stat-card"><div class="stat-value">70+</div><div class="stat-label">Components</div></div><div class="stat-card"><div class="stat-value">Zag.js</div><div class="stat-label">State Machines</div></div><div class="stat-card"><div class="stat-value">Vue 3</div><div class="stat-label">First\u2011class</div></div></div></section><section class="section"><div class="section-header"><h2 class="section-title">Component Index</h2><p class="section-subtitle">Jump into any category and start composing.</p></div><div class="nav-grid"><!--[-->`);
      ssrRenderList(unref(navigation), (group) => {
        _push(`<div class="nav-group"><div class="nav-group-title">${ssrInterpolate(group.title)}</div><div class="nav-list"><!--[-->`);
        ssrRenderList(group.items, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.href,
            to: item.href,
            class: "nav-card"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="nav-card-title"${_scopeId}>${ssrInterpolate(item.title)}</div><div class="nav-card-desc"${_scopeId}>View usage and examples</div>`);
              } else {
                return [
                  createVNode("div", { class: "nav-card-title" }, toDisplayString(item.title), 1),
                  createVNode("div", { class: "nav-card-desc" }, "View usage and examples")
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CqKMA6xD.mjs.map
