import { load, dump } from "js-yaml";

export default {
  description: "Encode/decode yaml text",
  actions: {
    encode: {
      description: "Convert JSON to YAML",
      default: true,
      input: "json",
      output: "text",
      async handler(input, output) {
        const json = dump(await input.asJson());
        output.send(json);
      },
    },

    decode: {
      description: "Convert YAML to JSON",
      input: "text",
      output: "json",
      async handler(input, output) {
        const yaml = load(await input.asText());
        output.send(yaml);
      },
    },
  },
};
