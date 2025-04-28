import sass from "sass";

export default {
  version: 2,
  actions: {
    toCSS: {
      default: true,
      input: "text",
      output: "text",
      handler: async function (input, output) {
        try {
          const options = {
            style: (input.options?.compressed && "compressed") || "expanded",
          };

          const result = sass.compileString(input.body, options);

          output.send(200, String(result.css));
        } catch (e) {
          console.error(e);
          output.reject(e);
        }
      },
    },
  },
};
