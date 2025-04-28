import pickManifest from "npm-pick-manifest";

export default {
  actions: {
    graph: {
      default: true,
      handler: async (input, output) => {
        const packages = [];
        const queue = [];
        const {
          name = "",
          version = "latest",
          optional = false,
          peer = false,
        } = input.options;
        if (name && version) {
          packages.push(`${name}@${version}`);
          queue.push([name, version, { optional, peer }]);
        } else {
          const list = await input.asJson();
          packages.push(...list);
          for (const item in list) {
            const parts = item.split("@");
            queue.push([parts[0], parts[1] || "latest", { optional, peer }]);
          }
        }

        if (!queue.length) {
          throw new Error("Nothing to analyze.");
        }

        const cache = new Map();
        const graph = new Graph();
        const errors = [];

        while (queue.length) {
          const next = queue.shift();
          await getDependencies(
            next[0],
            next[1],
            next[2],
            cache,
            graph,
            queue,
            errors,
          );
        }

        output.sendJson({
          packages,
          errors,
          graph,
        });
      },
    },
  },
};

async function getDependencies(
  name,
  version,
  options,
  cache,
  graph,
  queue,
  errors,
) {
  const nameAndVersion = `${name}@${version}`;
  if (graph.has(nameAndVersion)) {
    // console.log("repeated", nameAndVersion);
    return;
  }

  if (!cache.has(name)) {
    // console.log(`fetch ${name}`);
    const req = await fetch("https://registry.npmjs.org/" + name, {
      headers: { Connection: "keep-alive" },
    });
    const json = req.status === 200 ? await req.json() : {};

    if (req.status !== 200) {
      errors.push(`Failed to fetch ${name}: ${req.statusText}`);
      return;
    }

    cache.set(name, {
      name,
      "dist-tags": json["dist-tags"] || {},
      versions: json.versions || {},
    });
  }

  const cached = cache.get(name);
  let next;

  try {
    next = cache.get(nameAndVersion);
    if (!next) {
      next = pickManifest(cached, version);
      cache.set(nameAndVersion, next);
    }
  } catch (e) {
    console.log("pick error for %s@%s", name, version);
    console.log(e);
    errors.push(`${name} does not have a version for ${version}.`);
    return;
  }

  // console.log("picked %s for %s@%s", next.version, name, version);

  const {
    dependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  } = next;

  graph.add(nameAndVersion, {
    dependencies,
    peerDependencies: options.peer ? peerDependencies : null,
    optionalDependencies: options.optional ? optionalDependencies : null,
  });

  const list = [
    dependencies,
    options.peer && peerDependencies,
    options.optional && optionalDependencies,
  ].filter(Boolean);

  for (const map of list) {
    for (const entry of Object.entries(map)) {
      const [nextName, nextVersion] = entry;
      queue.push([nextName, nextVersion, options]);
    }
  }
}

class Graph {
  constructor() {
    this.names = [];
    this.dependencies = {};
    this.peerDependencies = {};
    this.optionalDependencies = {};
  }

  has(name) {
    return this.names.includes(name);
  }

  add(
    nameAndVersion,
    { dependencies, peerDependencies, optionalDependencies },
  ) {
    this.names.push(nameAndVersion);
    this.addTo(this.dependencies, dependencies);
    this.addTo(this.peerDependencies, peerDependencies);
    this.addTo(this.optionalDependencies, optionalDependencies);
  }

  addTo(target, map) {
    if (!map) {
      return;
    }

    for (const name of Object.keys(map)) {
      target[name] ||= new Set();
      target[name].add(map[name]);
    }
  }

  serialize(target) {
    return Object.fromEntries(
      Object.entries(target).map(([key, value]) => [key, [...value]]),
    );
  }

  toJSON() {
    return {
      dependencies: this.serialize(this.dependencies),
      peerDependencies: this.serialize(this.peerDependencies),
      optionalDependencies: this.serialize(this.optionalDependencies),
    };
  }
}
