#!/usr/bin/env node

import { Command } from "commander";
import degit from "degit";
import prompts from "prompts";
import packageJson from "../package.json";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command();

  program
    .name("create-vita")
    .description("Scaffold a new Vite + Alpine.js project")
    .argument("[project-name]", "name of the project folder")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )
    .action(
      /**
       * Create a new Vite + TSX + Alpine.js project
       * @param {string} projectName name of the project folder
       */
      async (projectName) => {
        const repo = "billybillydev/create-vita/apps/starter";

        const emitter = degit(repo, {
          cache: false,
          force: true,
          verbose: true,
        });

        // Ask for project name if not provided
        if (!projectName) {
          const res = await prompts({
            type: "text",
            name: "name",
            message: "Project name:",
            initial: "my-vite-alpine-app",
          });
          projectName = res.name;
        }

        await emitter.clone(projectName);

        // Update package.json name
        const pkgPath = `${process.cwd()}/${projectName}/package.json`;
        const pkgFile = Bun.file(pkgPath);

        if (await pkgFile.exists()) {
          const pkg = JSON.parse(await pkgFile.text(), "utf-8");
          pkg.name = projectName;

          await Bun.write(pkgPath, JSON.stringify(pkg, null, 2));
        }

        console.log(`\n✅ Done!`);
        console.log(`\nNext steps:\n`);
        console.log(`cd ${projectName}`);
        console.log(`npm install`);
        console.log(`npm run dev\n`);
      }
    );

  program.parse(process.argv);
}

main();
