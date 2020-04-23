import * as cp from "child_process";
import * as fs from "fs-extra";
import * as path from "path";
import pkgDir from "pkg-dir";
import { regexpReplacer } from "./regexp-replacer";

const identityTransform = (_src: string, dst: string, _dstFile: string) => dst;
export function manageModule(scope, name, description, isPrivate, cwd = process.cwd()) {
  const pDir = pkgDir.sync(cwd);
  const root = path.resolve(`${__dirname}/..`);
  if (pDir === root) {
    return;
  }
  const files = [
    [`.github/workflows/simple-ci.yml`, identityTransform],
    [`tsconfig.json`, identityTransform],
    [`tslint.json`, identityTransform],
    [`.gitignore`, identityTransform],
    [`.npmignore`, identityTransform],
    [`.editorconfig`, identityTransform],
    [`docs/DevTools.md`, identityTransform],
    [`code-of-conduct.md`, identityTransform],
    [`.vscode/launch.json`, identityTransform],
    [`.vscode/settings.json`, identityTransform],
    [`.vscode/tasks.json`, identityTransform],
    [`package.json`, mergePackageJson(scope, name, description, isPrivate)],
    [`README.md`, mergeREADME(scope, name, description)],
    [`LICENSE`, mergeLicense(isPrivate, root)],
  ];
  files.forEach(([relativeFpath, transformer]) =>
    copyOrModify(
      `${root}/${relativeFpath}`,
      `${pDir}/${relativeFpath}`,
      transformer as any));
  spawn(
    "npm",
    `config set @${scope}:registry https://npm.pkg.github.com/$scope`.split(" "),
    { cwd: pDir });
}

function copyOrModify(
  srcPath: string,
  dstPath: string,
  transformer: (src: string, dst: string, dfile: string) => string,
) {
  // tslint:disable: tsr-detect-non-literal-fs-filename
  if (!fs.statSync(srcPath).isFile()) {
    throw new Error(`copyOnModify only supports copying files`)
  }
  if (fs.existsSync(dstPath)) {
    const src = fs.readFileSync(srcPath, "utf8");
    const dst = transformer(
      src,
      fs.readFileSync(dstPath, "utf8"),
      dstPath,
    );
    fs.writeFileSync(dstPath, dst, "utf8");
  } else {
    fs.ensureDirSync(path.dirname(dstPath));
    fs.copySync(srcPath, dstPath);
  }
}

function mergeREADME(scope: string, name: string, description: string) {
  return (_src: string, dst: string, _dstFile: string) => {
    dst = regexpReplacer(dst,
      [{
        match: /tufan-io/g,
        replace: scope,
      }, {
        match: /dev-tooling/g,
        replace: name,
      }, {
        match: new RegExp("[TODO: Describe your module here]"),
        replace: description,
      }]);
    return dst;
  }
}

function mergeLicense(isPrivate: boolean, root: string) {
  return (_src: string, _dst: string, _dstFile: string) =>
    (isPrivate)
      ? fs.readFileSync(`${root}/docs/PRIVATE-LICENSE`, "utf8")
      : fs.readFileSync(`${root}/LICENSE`, "utf8");
}

function mergePackageJson(scope, name, description, isPrivate) {
  return (srcStr: string, dstStr: string, _dstFile: string) => {
    const src = JSON.parse(srcStr);
    const dst = JSON.parse(dstStr);
    dst[`run-batch`] = src[`run-batch`];
    dst.engines = src.engines;
    dst.ava = src.ava;
    dst.nyc = src.nyc;
    dst.name = name;
    dst.description = description;
    dst.husky = src.husky;
    dst.config = src.config;
    dst.scripts = src.scripts;
    if (isPrivate) {
      dst.license = "SEE LICENSE IN './LICENSE'";
    } else {
      dst.license = "Apache-2.0";
    }
    const serialized = JSON.stringify(dst, null, 2);
    // this changes any git urls embedded in package.json
    regexpReplacer(serialized, [{
      match: /tufan-io/g,
      replace: scope,
    }, {
      match: /dev-tooling/g,
      replace: name,
    }]);
    return serialized;
  };
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
