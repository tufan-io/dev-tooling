#!/usr/bin/env node
import { prompt } from "inquirer";
import { manageModule } from "./manage-module";
import { questions } from "./questions";

export function main(cwd = process.cwd()) {
  console.log({ cwd });
  return prompt(questions(cwd))
    .then(({ name, description, isPrivate, ...rest }) => {
      console.log({ name, description, isPrivate, rest });
      const parts = ["", ...name.split("/")].slice(-2);
      const scope = parts[0];
      name = parts[1];
      return manageModule(scope, name, description, isPrivate, cwd);
    });
}

if (!module.parent) {
  process.on("SIGINT", () => process.exit(-1));
  // tslint:disable-next-line: no-console
  main(process.cwd()).then(console.log).catch(console.error);
}
