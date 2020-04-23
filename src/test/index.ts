
import test from "ava";
import * as cp from "child_process";
import * as fs from "fs-extra";
import * as path from "path";
import { main } from "../index";

test(`main`, async (t) => {
  const tmp = path.resolve(`${__dirname}/../../.tmp/mock-module`);
  await fs.ensureDir(tmp);
  cp.spawnSync("npm", ["init", "-y"], { cwd: tmp });
  await main(tmp);
  cp.spawnSync("npm", ["init", "-y"], { cwd: tmp });
});
