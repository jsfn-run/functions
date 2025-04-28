import aws from "aws-sdk";

function getDynamo(input) {
  const accessKeyId = input.credentials["access-key-id"];
  const secretAccessKey = input.credentials["access-key-secret"];
  const region = input.credentials["region"];

  return new aws.DynamoDB({
    region,
    credentials: new aws.Credentials(accessKeyId, secretAccessKey),
  });
}

function executeAction(action, input, output, statusCode) {
  getDynamo(input)[action](input.body, (error, data) => {
    if (error) {
      return output.reject(error);
    }

    output.send(statusCode, data);
  });
}

const credentials = ["access-key-id", "access-key-secret", "region"];

export default {
  description: "Connect to an AWS DynamoDB",
  actions: {
    delete: {
      credentials,
      input: "json",
      output: "json",
      handler: (input, output) =>
        executeAction("deleteItem", input, output, 202),
    },
    get: {
      default: true,
      credentials,
      input: "json",
      output: "json",
      handler: (input, output) => executeAction("scan", input, output, 200),
    },
    create: {
      credentials,
      input: "json",
      output: "json",
      handler: (input, output) => executeAction("putItem", input, output, 201),
    },
    update: {
      credentials,
      input: "json",
      output: "json",
      handler: (input, output) =>
        executeAction("updateItem", input, output, 200),
    },
  },
};
