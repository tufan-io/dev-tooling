import test from "ava";
import * as fs from "fs-extra";

test(`refresh-templates`, async (t) => {
  await fs.remove(`${__dirname}/templates`);
  await fs.mkdir(`${__dirname}/templates`);
  await fs.copy(`${__dirname}/../../.github`, `${__dirname}/../../templates/.github`);
  await fs.copy(`${__dirname}/../../.gitignore`, `${__dirname}/../../templates/_gitignore`);
  await fs.copy(`${__dirname}/../../.npmignore`, `${__dirname}/../../templates/_npmignore`);
  await fs.copy(`${__dirname}/../../.editorconfig`, `${__dirname}/../../templates/.editorconfig`);
  await fs.copy(`${__dirname}/../../.vscode`, `${__dirname}/../../templates/.vscode`);
  await fs.copy(`${__dirname}/../../tsconfig.json`, `${__dirname}/../../templates/tsconfig.json`);
  await fs.copy(`${__dirname}/../../tslint.json`, `${__dirname}/../../templates/tslint.json`);
  await fs.copy(`${__dirname}/../../docs/code-of-conduct.md`, `${__dirname}/../../templates/code-of-conduct.md`);
  t.pass();
});
