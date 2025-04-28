import { parseSFC, getComponentCode } from "@li3/sfc";
import { minify } from "terser";

export default {
  description:
    "Convert a Lithium single-file component into a vanilla custom element. See https://github.com/apphorde/lithium for details",
  actions: {
    parse: {
      default: true,
      description: "Convert Lithium SFC into a custom element",
      options: {
        minify: "true",
        name: "string",
      },
      async handler(input, output) {
        try {
          const { name = "" } = input.options;
          const source = await input.asText();
          const parsed = parseSFC(source);
          let code = getComponentCode(name, parsed);

          if (input.options.minify) {
            const result = await minify(code, { module: true });
            code = result.code;
          }

          output.sendText(code);
        } catch (e) {
          console.log(e);
          throw e;
        }
      },
    },
  },
};
