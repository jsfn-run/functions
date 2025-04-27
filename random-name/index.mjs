import randomName from "@scaleway/random-name";

export default {
  version: 2,
  actions: {
    generate: {
      handler(input, output) {
        const { prefix = "", separator = "-" } = input.options;
        output.sendText(randomName(prefix, separator));
      },
    },
  },
};
