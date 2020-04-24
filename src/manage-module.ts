import * as cp from "child_process";
import * as fs from "fs-extra";
import * as path from "path";
import pkgDir from "pkg-dir";
import { regexpReplacer } from "./regexp-replacer";

const identityTransform = (src: string, _dst: string, _dstFile: string) => src;
export function manageModule(scope, name, description, isPrivate, version, cwd = process.cwd()) {
  const pDir = pkgDir.sync(cwd);
  const root = path.resolve(`${__dirname}/..`);
  if (pDir === root) {
    return;
  }
  const files = [
    [`docs/DevTools.md`, `docs/DevTools.md`, identityTransform],
    [`LICENSE`, `LICENSE`, mergeLicense(isPrivate, root)],
    [`package.json`, `package.json`, mergePackageJson(scope, name, description, isPrivate, version)],
    [`docs/sample-README.md`, `README.md`, mergeREADME(scope, name, description)],
    [`templates/.editorconfig`, `.editorconfig`, identityTransform],
    [`templates/.github/workflows/simple-ci.yml`, `.github/workflows/simple-ci.yml`, mergeSimpleCiYml(root, scope)],
    [`templates/_gitignore`, `.gitignore`, identityTransform],
    [`templates/_npmignore`, `.npmignore`, identityTransform],
    [`templates/.vscode/launch.json`, `.vscode/launch.json`, identityTransform],
    [`templates/.vscode/settings.json`, `.vscode/settings.json`, identityTransform],
    [`templates/.vscode/tasks.json`, `.vscode/tasks.json`, identityTransform],
    [`templates/code-of-conduct.md`, `code-of-conduct.md`, identityTransform],
    [`templates/tsconfig.json`, `tsconfig.json`, identityTransform],
    [`templates/tslint.json`, `tslint.json`, identityTransform],
  ];
  files.forEach(([srcPath, dstPath, transformer]: [string, string, any]) => {
    // tslint:disable-next-line: no-console
    console.log(`Updating ${dstPath}`);
    copyOrModify(`${root}/${srcPath}`, `${pDir}/${dstPath}`, transformer);
  });
  if (scope) {
    cp.spawn(
      "npm",
      `config set @${scope}:registry https://npm.pkg.github.com/$scope`.split(" "),
      { cwd: pDir });
  }
  if (!fs.pathExistsSync(`${pDir}/src`)) {
    fs.ensureDirSync(`${pDir}/src/test`);
    const sample = {
      src: [
        "export function main() {",
        "  return \"tufan.io wishes you have an awesome day!\";",
        "}",
        "",
      ].join("\n"),
      test: [
        "import test from \"ava\";",
        "import { main } from \"../index\";",
        "test(\"simple\", async (t) => {",
        "  t.snapshot(main());",
        "});",
        "",
      ].join("\n"),
    };
    // tslint:disable: tsr-detect-non-literal-fs-filename
    fs.writeFileSync(`${pDir}/src/index.ts`, sample.src, "utf8");
    fs.writeFileSync(`${pDir}/src/test/index.ts`, sample.test, "utf8");
  }
}

function copyOrModify(
  srcPath: string,
  dstPath: string,
  transformer: (src: string, dst: string, dfile: string) => string,
) {
  // tslint:disable: tsr-detect-non-literal-fs-filename
  if (!fs.statSync(srcPath).isFile()) {
    throw new Error(`copyOnModify only supports copying files`);
  }
  const src = fs.readFileSync(srcPath, "utf8");
  fs.ensureFileSync(dstPath);
  const dst = transformer(
    src,
    fs.readFileSync(dstPath, "utf8"),
    dstPath);
  fs.writeFileSync(dstPath, dst, "utf8");
}

function mergeREADME(scope: string, name: string, description: string) {
  const replacers = !!description
    ? [{
      match: /tufan-io/g,
      replace: scope,
    }, {
      match: /simple-ci/g,
      replace: name,
    }, {
      match: new RegExp("> TODO: Describe your module here"),
      replace: description,
    }]
    : [{
      match: /tufan-io/g,
      replace: scope,
    }, {
      match: /simple-ci/g,
      replace: name,
    }];
  return (src: string, dst: string, _dstFile: string) => {
    return !!dst
      ? dst
      : regexpReplacer(src, replacers);
  };
}

function mergeLicense(isPrivate: boolean, root: string) {
  const license = (isPrivate)
    ? fs.readFileSync(`${root}/docs/PRIVATE-LICENSE`, "utf8")
    : fs.readFileSync(`${root}/LICENSE`, "utf8");
  return (_src: string, _dst: string, _dstFile: string) => license;
}

function mergePackageJson(scope, name, description, isPrivate, version) {
  return (srcStr: string, dstStr: string, _dstFile: string) => {
    const src = JSON.parse(srcStr);
    const dst = JSON.parse(dstStr);
    dst[`run-batch`] = src[`run-batch`];
    dst.name = `@${scope}/${name}`;
    dst.description = description;
    dst.engines = src.engines;
    dst.publishConfig = src.publishConfig;
    dst.ava = src.ava;
    dst.nyc = src.nyc;
    dst.husky = src.husky;
    dst.config = src.config; // commitzen
    dst.scripts = src.scripts;
    dst.scripts["dep-check"] = "dependency-check . --no-dev";
    dst.files = ["dist", "docs"];
    delete dst.scripts.postintall;
    if (isPrivate) {
      dst.license = "SEE LICENSE IN './LICENSE'";
    } else {
      dst.license = "Apache-2.0";
    }
    dst.publishConfig = {
      "registry": "https://npm.pkg.github.com/",
    };
    dst["simple-ci"] = {
      version,
    };
    // this changes any git urls embedded in package.json
    const serialized = JSON.stringify(dst, null, 2);
    regexpReplacer(serialized, [{
      match: /tufan-io/g,
      replace: scope,
    }, {
      match: /simple-ci/g,
      replace: name,
    }]);
    return serialized;
    // possibly deal with version upgrades here.
  };
}

function mergeSimpleCiYml(root: string, scope: string) {
  return (src: string, _dst: string, _dstFile: string) =>
    regexpReplacer(src, [{
      match: /tufan-io/g,
      replace: scope,
    }]);
}

function spawn(cmd: string, args: string[], opts: object = {}) {
  opts = {
    cwd: process.cwd(),
    stdio: "inherit",
    ...opts,
  };
  // tslint:disable-next-line: no-console
  console.log([cmd].concat(args).join(" "));
  return cp.spawnSync(cmd, args, opts);
}
