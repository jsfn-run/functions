import { createHash } from "crypto";

export default {
  version: 2,
  actions: {
    md5: {
      handler(input, output) {
        const hash = createHash("md5");
        input.on("data", (c) => hash.update(c));
        input.on("end", () => output.send(hash.digest("hex")));
      },
    },
  },
};
