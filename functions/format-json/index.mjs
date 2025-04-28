export default {
  version: 2,
  actions: {
    format: {
      handler: async (input, output) => {
        const { format } = input.options;
        output.sendText(JSON.stringify(await input.asJson(), null, format));
      },
    },
  },
};
