import { AlgemeneHeffingsKorting } from "belasting";

export default {
  version: 2,
  actions: {
    belasting: {
      default: true,
      options: {
        year: "number",
        income: "number, no decimals",
      },
      handler(input, output) {
        output.sendText(String(new AlgemeneHeffingsKorting(input.options).tax));
      },
    },
  },
};
