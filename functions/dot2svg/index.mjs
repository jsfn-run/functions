import { Graphviz } from "@hpcc-js/wasm";

export default {
  actions: {
    svg: {
      default: true,
      handler: async (input, output) => {
        const { layout = "dot", ...options } = input.options;
        const dot = await input.asText();
        const graphviz = await Graphviz.load();
        const svg = graphviz.layout(dot, "svg", layout, options);

        output.setHeader("content-type", "image/svg+xml");
        output.sendText(svg);
      },
    },
  },
};
