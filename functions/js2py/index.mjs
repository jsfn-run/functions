import convert from "https://aifn.run/fn/7c97f732-d87e-4fb5-9676-988cb62e953f.js";

export default {
  actions: {
    convert: {
      default: true,
      handler: async (input, output) => {
        const code = await input.asText();
        const py = await convert({
          source: "javascript",
          target: "python",
          code,
        });
        output.sendText(py);
      },
    },
  },
};
