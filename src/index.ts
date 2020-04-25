#!/usr/bin/env node
import { prompt } from "inquirer";
import * as readPkgUp from "read-pkg-up";
import { manageModule } from "./manage-module";
import { questions } from "./questions";

export function main(cwd = process.cwd()) {
  const { packageJson } = readPkgUp.sync({ cwd });
  return prompt(questions(packageJson.name, packageJson.description, packageJson.private !== false))
    .then(({ pkgname, description, isPrivate, registry, pkgname1 }) => {
      const [scope, name] = [
        "tufan-io",
        ...((pkgname1 || pkgname) as string).split("/"),
      ].slice(-2);
      return manageModule(scope, name, description, isPrivate, registry, cwd);
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
