import { Buffer } from "node:buffer";

const formats = /^(mp3|opus|aac|flac)$/;
const voices = /^(alloy|echo|fable|onyx|nova|shimmer)$/;

export default {
  description: "Text-to-speech",
  actions: {
    speak: {
      default: true,
      input: "text",
      options: {
        voice: "alloy, echo, fable, onyx, nova, or shimmer",
        hd: "set to true for high quality",
        format: "opus, aac, flac or mp3",
        speed: "between 0.25 and 4",
      },
      handler: async (input, output) => {
        const {
          voice = "alloy",
          format = "mp3",
          hd = false,
          speed = "1",
        } = input.options;

        if (!voices.test(voice)) {
          return output.reject("Invalid voice: " + voice);
        }

        if (!formats.test(format)) {
          return output.reject("Invalid format: " + format);
        }

        const speedAsNumber = Number(speed);

        if (speed < 0.25 || speed > 4) {
          return output.reject("Invalid speed: " + speed);
        }

        const text = await input.asText();
        if (!text) {
          return output.reject("No text provided");
        }

        const model = hd ? "tts-1-hd" : "tts-1";
        const res = await fetch(process.env.TTS_API_ENDPOINT, {
          method: "POST",
          body: JSON.stringify({
            model,
            voice,
            response_format: format,
            speed: speedAsNumber,
            input: text,
          }),
        });

        if (!res.ok) {
          return output.reject("Failed: " + await res.text());
        }

        const arrayBuffer = await res.arrayBuffer();
        output.sendBuffer(Buffer.from(arrayBuffer));
      },
    },
  },
};
