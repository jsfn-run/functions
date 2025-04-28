import { SourceMapConsumer } from "source-map";

export default {
  actions: {
    decode: {
      default: true,
      async handler(input, output) {
        const json = await input.asJson();
        const consumer = await new SourceMapConsumer(json);
        const { sources } = consumer;

        output.sendJson({
          sources: sources.map((source) => {
            const { line, column } = consumer.originalPositionFor({
              line: 1,
              column: 0,
            });
            return {
              source,
              line,
              column,
            };
          }),
        });
      },
    },
  },
};
