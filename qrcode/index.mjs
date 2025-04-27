import QRCode from "qrcode";

export default {
  actions: {
    encode: {
      default: true,
      description:
        "Generate a QRCode PNG.\nSee all options at https://www.npmjs.com/package/qrcode#qr-code-options",
      async handler(input, output) {
        const data = await input.asBuffer();

        QRCode.toDataURL(
          [{ data, mode: "byte", ...input.options }],
          function (error, url) {
            if (error) {
              return output.reject(error);
            }
            const image = Buffer.from(
              url.replace("data:image/png;base64,", ""),
              "base64",
            );
            output.sendBuffer(image);
          },
        );
      },
    },
  },
};
