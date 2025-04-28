import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export default {
  description: "Encode/decode CSV",
  actions: {
    decode: {
      default: true,
      description: "Decode a CSV into a JSON array",
      async handler(input, output) {
        const csv = await input.asText();
        output.sendJson(parse(csv));
      },
    },
    encode: {
      description: "Encode a JSON array as CSV",
      async handler(input, output) {
        const json = await input.asJson();

        if (!Array.isArray(json)) {
          throw new Error("Invalid input");
        }

        output.sendText(stringify(json));
      },
    },
  },
};
