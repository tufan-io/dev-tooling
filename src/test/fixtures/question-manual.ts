#!/usr/bin/env node
import { prompt } from "inquirer";
import readPkgUp from "read-pkg-up";
import { questions } from "../../questions";

const pkg = readPkgUp.sync({ cwd: process.cwd() }).packageJson;

const registry = "https://npm.pkg.github.com";
const qs = questions(
  pkg.name,
  pkg.description,
  pkg.private !== false,
  registry
);
prompt(qs).then(console.log).catch(console.error);
