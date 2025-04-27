import { Buffer } from "node:buffer";

const formats = /^(mp3|opus|aac|flac)$/;
const voices = /^(alloy|echo|fable|onyx|nova|shimmer)$/;

export default {
  description: "Text-to-speech",
  actions: {
    install: {
      description:
        "Makes text-to-speech available as a function. Use it as window.speak(text)",
      output: "dom",
      handler(_, output) {
        const html = `<audio id="__tts__"></audio>
<script type="module">
import tts from 'https://tts.jsfn.run/index.mjs';
window.speak = async (text) => {
  const r = await tts(text);
  if (!r.ok) {
    throw new Error('Failed to convert text');
  }
  const blob = new Blob([await r.arrayBuffer()], { type: "audio/mp3" });
  const href = URL.createObjectURL(blob);
  window.__tts__.src = href;
  window.__tts__.play();
};
</script>`;
        output.send(html);
      },
    },
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
        const res = await fetch("https://voice.api.apphor.de/", {
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
          return output.reject("Failed");
        }

        const arrayBuffer = await res.arrayBuffer();
        output.sendBuffer(Buffer.from(arrayBuffer));
      },
    },
  },
};
