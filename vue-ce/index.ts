import { defineCustomElement } from "vue";
import main from "./main.ce.vue";
export * from "./main.ce.vue";
import "./index.css";

main.styles ||= [];
main.styles.push(__component__styles__);

export const component = defineCustomElement(main);
export const name = "__component__name__";

customElements.define(name, component);
