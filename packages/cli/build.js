import { build } from "esbuild";

const b = () =>
  build({
    bundle: true,
    entryPoints: ["./src/index.js"],
    banner: {
      js: "#!/usr/bin/env bun",
    },
    platform: "node",
    outfile: "bin",
    format: "cjs",
    // For debug
    minify: false,
  });

Promise.all([b()]);
