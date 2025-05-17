const _ = process.env;
const outputFormats = /^(json|text)$/;

// TODO use FormData and test again with Node LTS
const C1 = Buffer.from(
  '--------------------------xMUfH1yXtLKFZScZN18w2W\r\nContent-Disposition: form-data; name="file"; filename="audio.mp3"\r\nContent-Type: application/octet-stream\r\n\r\n'
);
const C2 = Buffer.from(
  '\r\n--------------------------xMUfH1yXtLKFZScZN18w2W\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n--------------------------xMUfH1yXtLKFZScZN18w2W--\r\n'
);
const C3 =
  "multipart/form-data; boundary=------------------------xMUfH1yXtLKFZScZN18w2W";

async function transcribe(input, response) {
  const { output = "text", language = "" } = input.options;

  if (!outputFormats.test(output)) {
    return response.reject("Invalid output format: " + output);
  }

  const buffer = await input.asBuffer();
  const chunks = [C1, buffer, C2];

  if (language) {
    chunks.push(
      Buffer.from(
        `\r\n--------------------------xMUfH1yXtLKFZScZN18w2W\r\nContent-Disposition: form-data; name="language"\r\n\r\n${language}\r\n`
      )
    );
  }

  const formData = Buffer.concat(chunks);

  const res = await fetch(_.VTT_API_ENDPOINT, {
    method: "POST",
    body: formData,
    headers: {
      "content-type": C3,
      "content-length": formData.length,
    },
  });

  const responseText = await res.text();

  if (!res.ok) {
    return response.reject(responseText);
  }

  const text = JSON.parse(responseText).text;

  if (output === "json") {
    response.sendJson({ text });
    return;
  }

  response.sendText(text);
}

export default {
  description: "Voice-to-text",
  actions: {
    transcribe: {
      default: true,
      description: "Convert voice to text",
      output: "text",
      options: {
        output: "text or json",
        language: "input language (optional)",
      },
      handler: transcribe,
    },
  },
};
