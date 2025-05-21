const _ = process.env;

async function transcribe(input, response) {
  const { output = "", language = "", model = "whisper-1" } = input.options;
  const buffer = await input.asBuffer();
  const formData = new FormData();

  if (language) {
    formData.set("language", language);
  }

  formData.set("model", model);
  formData.append(
    "file",
    new Blob([buffer], { type: "application/octet-stream" }),
    "audio.mp3"
  );

  const res = await fetch(_.VTT_API_ENDPOINT, {
    method: "POST",
    body: formData,
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
        model: "AI model (optional)",
      },
      handler: transcribe,
    },
  },
};
