import { parse } from "@homebots/parse-html";
import { normalize } from "@homebots/parse-html-runtime";

export default {
  description:
    "Parse HTML and return a JSON structure. See https://github.com/homebots/parse-html for details",
  version: 2,
  actions: {
    parse: {
      default: true,
      description:
        "Parse HTML into a JSON structure. Set `normalize` option to remove blank spaces",
      options: {
        normalize: "true/false",
      },
      handler: async (input, output) => {
        const nodes = parse(await input.asText());

        if (input.options.normalize) {
          normalize(nodes);
        }

        output.sendJson(nodes);
      },
    },
  },
};
