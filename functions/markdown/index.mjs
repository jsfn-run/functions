import MarkdownIt from "markdown-it";

export default {
  actions: {
    render: {
      input: "text",
      output: "text",
      default: true,
      async handler(input, output) {
        const markdown = new MarkdownIt("default", input.options);
        output.send(markdown.render(await input.asText()));
      },
    },
  },
};
