import { readFileSync } from "fs";
import hljs from "highlight.js";

const wrapperTemplate = readFileSync("./embed.html", "utf8");

async function highlight(input, output) {
  const { embed = false, language = "text" } = input.options || {};
  const source = await input.asText();
  const code = language
    ? hljs.highlight(language, source).value
    : hljs.highlightAuto(source).value;

  const codeWithTemplate = embed
    ? wrapperTemplate.replace("%code%", code)
    : code;

  try {
    output.send(codeWithTemplate);
  } catch (error) {
    output.reject(String(error));
  }
}

export default {
  version: 2,
  actions: {
    load: {
      output: "dom",
      handler(input, output) {
        output.send(
          `<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/styles/default.min.css" />`,
        );
      },
    },
    highlight: {
      default: true,
      input: "text",
      output: "text",
      handler: highlight,
    },
  },
};
