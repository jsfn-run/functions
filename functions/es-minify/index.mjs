import { minify } from "terser";

export default {
  actions: {
    minify: {
      default: true,
      async handler(input, output) {
        const source = await input.asText();
        const result = await minify(source, input.options);

        if (input.options.json) {
          return output.sendJson(result);
        }

        output.sendText(result.code);
      },
    },
  },
};
