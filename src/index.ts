#!/usr/bin/env node
import { prompt } from "inquirer";
import * as readPkgUp from "read-pkg-up";
import { manageModule } from "./manage-module";
import { questions } from "./questions";

export function main(cwd = process.cwd()) {
  const { packageJson } = readPkgUp.sync({ cwd });
  return prompt(questions(packageJson.name, packageJson.description))
    .then(({ pkgname, description, isPrivate }) => {
      const [scope, name] = [
        "tufan-io",
        ...(pkgname as string).replace(/^@/, "").split("/"),
      ].slice(-2);
      return manageModule(scope, name, description, isPrivate, packageJson.version, cwd);
    });
}

if (!module.parent) {
  process.on("SIGINT", () => process.exit(-1));
  // tslint:disable: no-console
  main(process.cwd())
    .then(() => {
      console.log(`\nSuccessfully configured 'simple-ci'. To finish, execute\n  npm run build`);
    })
    .catch(console.error);
}
