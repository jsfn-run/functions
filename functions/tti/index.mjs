export default {
  actions: {
    draw: {
      description: `Generates an image from text with DALL-E

Sizes:
- 256x256, 512x512 or 1024x1024      for version=2
- 1024x1024, 1792x1024 or 1024x1792  for version=3
`,
      default: true,
      input: "text",
      options: {
        version: "2 or 3",
        size: "image size",
      },
      async handler(input, output) {
        const version = Number(input.options.version) || 2;
        const { size = "256x256" } = input.options;
        const model = version === 3 ? "dall-e-3" : "dall-e-2";
        const prompt = await input.asText();

        if (prompt.length < 10) {
          throw new Error("Input text too short");
        }

        const remote = await fetch("https://imagen.api.apphor.de", {
          method: "POST",
          body: JSON.stringify({
            model,
            prompt,
            n: 1,
            response_format: "b64_json",
            size,
          }),
        });

        const gen = await remote.json();
        const buffer = Buffer.from(gen.data[0].b64_json, "base64");

        output.sendBuffer(buffer);
      },
    },
  },
};
