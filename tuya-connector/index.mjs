import { TuyaContext } from "@tuya/tuya-connector-nodejs";

const credentials = ["clientId", "clientSecret"];
const baseOptions = { clientId: "string", clientSecret: "string" };
const deviceIdOption = { deviceId: "string" };
const log = (...args) => process.env.DEBUG && console.log(...args);

const api = {
  description: `Interact with any Tuya-powered devices.

Options:
- clientId/clientSecret: Both options are required. Available from https://iot.tuya.com/cloud/basic
- deviceId: Optional. Some commands require a deviceId

Additional options are described by the available functions.
`,
  actions: {
    request: {
      default: true,
      credentials,
      async handler(request, response) {
        tuyaRequest(request, response, await request.asJson());
      },
    },
    commands: {
      description: "Send commands to a device",
      input: "json",
      credentials,
      options: { ...baseOptions, ...deviceIdOption },
      handler(request, response) {
        const { deviceId } = request.options;
        const commands = request.body;
        log(deviceId, commands);
        tuyaRequest(request, response, {
          method: "POST",
          path: `/v1.0/devices/${deviceId}/commands`,
          body: { commands },
        });
      },
    },
    switchSet: {
      description: "Switch a relay on/off.",
      credentials,
      options: { ...baseOptions, ...deviceIdOption, value: "true/false" },
      handler: tuyaCommand("switch_1", (request) =>
        toBoolean(request.options.value),
      ),
    },
    switchState: {
      description: "Set state for next countdown trigger.",
      credentials,
      options: {
        ...baseOptions,
        ...deviceIdOption,
        value: "power_on/power_off/last",
      },
      handler: tuyaCommand("relay_status", (request) => request.options.value),
    },
    countdown: {
      description: "Countdown to trigger a relay.",
      credentials,
      options: {
        ...baseOptions,
        ...deviceIdOption,
        value: "number of seconds from 0 to 86400",
      },
      handler: tuyaCommand("countdown_1", (request) =>
        Number(request.options.value),
      ),
    },
    switchLed: {
      description: "Switch a lamp on/off.",
      credentials,
      options: { ...baseOptions, ...deviceIdOption, value: "true/false" },
      handler: tuyaCommand("switch_led", (request) =>
        toBoolean(request.options.value),
      ),
    },
    workMode: {
      description: "Change lamp working mode.",
      credentials,
      options: {
        ...baseOptions,
        ...deviceIdOption,
        value: "white/colour/scene/music",
      },
      handler: tuyaCommand("work_mode", (request) =>
        String(request.options.value),
      ),
    },
    brightness: {
      description: "Change lamp brightness.",
      credentials,
      options: {
        ...baseOptions,
        ...deviceIdOption,
        value: "number from 10 to 1000",
      },
      handler: tuyaCommand("bright_value_v2", (request) =>
        Number(request.options.value),
      ),
    },
    colorTemperature: {
      description: "Change lamp color temperature.",
      credentials,
      options: {
        ...baseOptions,
        ...deviceIdOption,
        value: "number from 0 to 1000",
      },
      handler: tuyaCommand("temp_value_v2", (request) =>
        Number(request.options.value),
      ),
    },
    color: {
      options: { ...baseOptions, ...deviceIdOption },
      description:
        "Change lamp color.\nInput: a JSON with { h: 0~360, s: 0~1000, v: 0~1000 }",
      credentials,
      handler: tuyaCommand("colour_data_v2", (request) => request.asJson()),
    },
    status: {
      options: { ...baseOptions, ...deviceIdOption },
      description: "Get device status",
      credentials,
      output: "json",
      handler(request, response) {
        const { deviceId } = request.options;

        tuyaRequest(
          request,
          response,
          {
            method: "GET",
            path: `/v1.0/devices/${deviceId}/status`,
          },
          (err, data) => {
            response.sendJson(err ? data : data.result);
          },
        );
      },
    },
  },
};

function toBoolean(value) {
  return String(value) === "true" || String(value) === "1";
}

function tuyaCommand(name, valueFn) {
  return async function (request, response) {
    const { deviceId } = request.options;
    tuyaRequest(request, response, {
      method: "POST",
      path: `/v1.0/devices/${deviceId}/commands`,
      body: {
        commands: [{ code: name, value: await valueFn(request) }],
      },
    });
  };
}

async function tuyaRequest(request, response, payload, handler) {
  const options = { ...request.credentials, ...request.options };

  if (!(options.clientId && options.clientSecret)) {
    response.reject(
      new Error("clientId and clientSecret are required to continue"),
    );
    return;
  }

  const context = getContext(options);
  const { data, status } = await context.client.request(payload);

  log("options:", stringify(options));
  log("request:", stringify(payload));
  log("response:", status, data);

  const success = status < 300 && data.success;

  if (handler) {
    return handler(!success, data);
  }

  if (success) {
    response.sendJson(data);
    return;
  }

  response.reject(JSON.stringify(data));
}

function stringify(v) {
  return JSON.stringify(v, null, 2);
}

function getContext(options) {
  const { region = "EU", clientId, clientSecret } = options;

  return new TuyaContext({
    baseUrl: `https://openapi.tuya${region.toLowerCase()}.com`,
    accessKey: clientId,
    secretKey: clientSecret,
  });
}

export default api;
