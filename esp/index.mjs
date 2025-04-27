import { compile } from "@homebots/espresso-compiler";
import { Buffer } from "node:buffer";

export default {
  version: 2,
  actions: {
    compile: {
      default: true,
      input: "text",
      options: {
        buffer: "true",
        format: "hex|utf8|base64|ascii",
      },
      handler(input, output) {
        const bytes = compile(input.body);
        const buffer = Buffer.from(bytes);

        const formatted = input.options.buffer
          ? buffer
          : buffer.toString(input.options.format || "hex");

        output.send(formatted);
      },
    },
  },
};
