import ts from "typescript";

export default {
  actions: {
    parse: {
      default: true,
      async handler(input, output) {
        const source = await input.asText();
        const parsed = ts.createSourceFile(
          "index.ts",
          source,
          ts.ScriptTarget.ES2022
        );
        const list = [];
        const text = JSON.stringify(parsed, (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (list.includes(value)) return;
            list.push(value);
          }

          return value;
        });
        output.sendText(text);
      },
    },
  },
};
