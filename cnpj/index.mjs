import { validate, format, generate } from "cnpj";

const digits = [];
let max = 99;

while (max) {
  digits.push(String(max--).padStart(2, "0"));
}

export default {
  actions: {
    validate: {
      description: "Validate a Brazilian CNPJ number",
      default: true,
      async handler(input, output) {
        const number = (await input.asText()).trim();
        console.log(number);
        output.sendJson(validate(number));
      },
    },
    generate: {
      description: "Generate a Brazilian CNPJ number",
      options: {
        formatted: "Boolean. Set it to get a formatted value",
      },
      handler(input, output) {
        const number = generate();
        output.sendText(input.options.formatted ? format(number) : number);
      },
    },
    format: {
      description: "Format a Brazilian CNPJ number",
      async handler(input, output) {
        const number = await input.asText();
        output.sendText(format(number));
      },
    },
    complete: {
      description: "Add validation digits to a CNPJ number",
      async handler(input, output) {
        const number = (await input.asText()).trim();
        const digit = digits.find((next) => validate(number + next));

        if (!digit) {
          output.reject(new Error("Invalid number to complete"));
          return;
        }

        output.sendText(number + digit);
      },
    },
  },
};
