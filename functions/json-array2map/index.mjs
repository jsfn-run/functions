export default {
  actions: {
    map: {
      default: true,
      options: {
        key: "property to use as key",
      },
      async handler(input, output) {
        const json = input.asJson();
        if (!Array.isArray(json)) {
          throw new Error("Invalid input. Must be an array.");
        }

        const map = json.reduce((map, next) => {
          map[next[key]] = next;
          return map;
        }, {});

        output.sendJson(map);
      },
    },
  },
};
