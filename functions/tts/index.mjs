import { Buffer } from "node:buffer";
const _ = process.env;

export default {
  description: "Text-to-speech",
  actions: {
    speak: {
      default: true,
      input: "text",
      options: {
        model: "which model to use",
        voice: "which model voice to use",
        format: "output format",
        speed: "between 0.25 and 4",
      },
      handler: async (input, output) => {
        const {
          model = _.TTS_DEFAULT_MODEL,
          voice = _.TTS_DEFAULT_VOICE,
          format = "mp3",
          speed = "1",
        } = input.options;
        
        const speedAsNumber = Number(speed);

        if (speed < 0.25 || speed > 4) {
          return output.reject("Invalid speed: " + speed);
        }

        const text = await input.asText();
        if (!text) {
          return output.reject("No text provided");
        }

        const res = await fetch(process.env.TTS_API_ENDPOINT, {
          method: "POST",
          headers: {'content-type': 'application/json' },
          body: JSON.stringify({
            model,
            voice,
            response_format: format,
            speed: speedAsNumber,
            input: text,
          }),
        });

        if (!res.ok) {
          return output.reject(await res.text());
        }

        const arrayBuffer = await res.arrayBuffer();
        output.sendBuffer(Buffer.from(arrayBuffer));
      },
    },
  },
};
