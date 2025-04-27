import { parse } from "acorn";

export default {
  actions: {
    parse: {
      default: true,
      async handler(input, output) {
        const source = await input.asText();
        const parsed = parse(source, {
          ecmaVersion: 2023,
          sourceType: "module",
        });
        output.sendJson(parsed);
      },
    },
  },
};
