import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { writeFile, readFile } from "fs/promises";

const componentNameRule = /^[a-z]+-[a-z]+$/;
const queueInterval = 1000;
const queue = {
  timer: 0,
  all: [],
  running: false,

  add(item) {
    queue.all.push(item);
    queue.next();
  },

  schedule() {
    clearTimeout(queue.timer);
    queue.timer = setTimeout(queue.next, queueInterval);
  },

  async next() {
    if (queue.running) {
      queue.schedule();
      return;
    }

    if (!queue.all.length) {
      queue.running = false;
      return;
    }

    queue.running = true;
    const nextItem = queue.all.shift();

    await generateComponent(nextItem);
    queue.running = false;
    queue.schedule();
  },
};

const outputFile = "./dist/index.mjs";

async function generateComponent(nextItem) {
  try {
    if (!componentNameRule.test(nextItem.name)) {
      throw new Error("Invalid component name.");
    }

    if (!nextItem.source.trim()) {
      throw new Error("Invalid component source.");
    }

    await writeFile("./main.ce.vue", nextItem.source, "utf-8");
    const sh = spawnSync("npx", ["vite", "build"]);

    if (sh.status || !existsSync(outputFile)) {
      throw new Error([sh.stdout, sh.stderr].join("\n---\n"));
    }

    const result = await readFile(outputFile, "utf-8");
    nextItem.response.sendText(
      result.replace(/__component__name__/g, nextItem.name),
    );
  } catch (error) {
    console.log(new Date().toISOString(), error);
    nextItem.response.reject(error);
  }
}

export default {
  actions: {
    compile: {
      default: true,
      async handler(input, output) {
        const { name } = input.options;
        const body = await input.asText();
        queue.add({ name, source: body, response: output });
      },
    },
  },
};
