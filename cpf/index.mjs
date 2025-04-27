import CPF from "cpf-check";

export default {
  actions: {
    validate: {
      description: "Validate a Brazilian CPF number",
      default: true,
      async handler(input, output) {
        const number = await input.asText();
        output.sendJson(CPF.validate(number));
      },
    },
    generate: {
      description: "Generate a Brazilian CPF number",
      options: {
        formatted: "Boolean. Set it to get a formatted value",
      },
      handler(input, output) {
        output.sendText(CPF.generate(input.options.formatted));
      },
    },
  },
};
