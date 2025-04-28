import { randomBytes } from "node:crypto";

export default {
  version: 2,
  actions: {
    generate: {
      options: {
        size: "number of bytes, max 4096",
      },
      handler: (input, output) => {
        const inputSize = input.options.size | 0;
        const size = (inputSize && Math.min(inputSize, 4096)) || 64;
        const buffer = randomBytes(size);

        output.send(buffer);
      },
    },
  },
};
