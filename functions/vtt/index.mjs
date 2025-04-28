const outputFormats = /^(json|text)$/;

const C1 = Buffer.from(
  '--------------------------xMUfH1yXtLKFZScZN18w2W\r\nContent-Disposition: form-data; name="file"; filename="audio.mp3"\r\nContent-Type: application/octet-stream\r\n\r\n',
);
const C2 = Buffer.from(
  '\r\n--------------------------xMUfH1yXtLKFZScZN18w2W\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n--------------------------xMUfH1yXtLKFZScZN18w2W--\r\n',
);
const C3 =
  "multipart/form-data; boundary=------------------------xMUfH1yXtLKFZScZN18w2W";

export default {
  description: "Voice-to-text",
  actions: {
    transcribe: {
      default: true,
      description: "Convert voice to text",
      output: "text",
      options: {
        output: "text or json",
        format: "input media type, like audio/mp3",
      },
      handler: async (input, response) => {
        const { output = "text", type = "" } = input.options;

        if (!outputFormats.test(output)) {
          return response.reject("Invalid output format: " + output);
        }

        const buffer = await input.asBuffer();
        const formData = Buffer.concat([C1, buffer, C2]);

        const res = await fetch("https://vtt.api.apphor.de", {
          method: "POST",
          body: formData,
          headers: {
            "content-type": C3,
            "content-length": formData.length,
          },
        });

        if (!res.ok) {
          const body = await res.text();
          return response.reject("Failed to convert: " + body);
        }

        const responseText = await res.text();
        const text = JSON.parse(responseText).text;

        if (output === "json") {
          response.sendJson({ text });
          return;
        }

        response.sendText(text);
      },
    },
  },
};
