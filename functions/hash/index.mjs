import { createHash } from "node:crypto";

export default {
  version: 2,
  description: "Create a hash from the input",
  actions: {
    createHash: {
      default: true,
      options: {
        type: "a valid Node.js hash algorithm, like sha256",
      },
      handler(input, output) {
        const type = input.options.type || "sha256";
        const hash = createHash(type);
        input.on("data", (c) => hash.update(c));
        input.on("end", () => output.sendText(hash.digest("hex")));
      },
    },
  },
};
