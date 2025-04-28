import md from "cli-markdown";

export default {
  actions: {
    render: {
      default: true,
      async handler(input, output) {
        const markdown = await input.asText();
        const text = md(markdown);
        output.sendText(text);
      },
    },
  },
};
