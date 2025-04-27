import Ajv from "ajv";

export default {
  version: 2,
  actions: {
    validate: {
      description: "Validate a JSON against a schema.",
      default: true,
      handler: async (input, output) => {
        const validator = new Ajv({ allErrors: true, schemaId: "auto" });
        const { schema, json } = await input.asJson();
        validator.validate(schema, json);
        output.sendJson(validator.errors);
      },
    },
  },
};
