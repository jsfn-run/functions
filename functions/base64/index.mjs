export default {
  actions: {
    encode: {
      default: true,
      async handler(input, output) {
        const buffer = await input.asBuffer();
        output.sendText(buffer.toString("base64"));
      },
    },
    decode: {
      async handler(input, output) {
        const text = await input.asText();
        output.sendBuffer(Buffer.from(text, "base64"));
      },
    },
  },
};
