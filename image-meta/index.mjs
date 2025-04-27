import { imageMeta } from "image-meta";

export default {
  actions: {
    imageMeta: {
      async handler(input, output) {
        output.sendJson(imageMeta(await input.asBuffer()));
      },
    },
  },
};
