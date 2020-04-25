"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const pkg_dir_1 = require("pkg-dir");
const readPkgUp = require("read-pkg-up");
const regexp_replacer_1 = require("./regexp-replacer");
const identityTransform = (src, _dst, _dstFile) => src;
function manageModule(scope, name, description, isPrivate, registry, cwd = process.cwd()) {
    const pDir = pkg_dir_1.default.sync(cwd);
    // get simple-ci version
    const { packageJson: { version } } = readPkgUp.sync({ cwd: __dirname });
    const root = path.resolve(`${__dirname}/..`);
    if (pDir === root) {
        return;
    }
    const files = [
        [`docs/DevTools.md`, `docs/DevTools.md`, identityTransform],
        [`LICENSE`, `LICENSE`, mergeLicense(isPrivate, root)],
        [`package.json`, `package.json`, mergePackageJson(scope, name, description, isPrivate, registry, version)],
        [`docs/sample-README.md`, `README.md`, mergeREADME(scope, name, description)],
        [`templates/.editorconfig`, `.editorconfig`, identityTransform],
        [`templates/.github/workflows/action-ci.yml`, `.github/workflows/action-ci.yml`, mergeActionCiYml(root, scope)],
        [`templates/_gitignore`, `.gitignore`, identityTransform],
        [`templates/_npmignore`, `.npmignore`, identityTransform],
        [`templates/_npmrc`, `.npmrc`, identityTransform],
        [`templates/.vscode/launch.json`, `.vscode/launch.json`, identityTransform],
        [`templates/.vscode/settings.json`, `.vscode/settings.json`, identityTransform],
        [`templates/.vscode/tasks.json`, `.vscode/tasks.json`, identityTransform],
        [`templates/code-of-conduct.md`, `docs/code-of-conduct.md`, identityTransform],
        [`templates/tsconfig.json`, `tsconfig.json`, identityTransform],
        [`templates/tslint.json`, `tslint.json`, identityTransform],
    ];
    files.forEach(([srcPath, dstPath, transformer]) => {
        // tslint:disable-next-line: no-console
        console.log(`Updating ${dstPath}`);
        copyOrModify(`${root}/${srcPath}`, `${pDir}/${dstPath}`, transformer);
    });
    if (scope && registry === "https://npm.pkg.github.com") {
        cp.spawn("npm", `config set @${scope}:registry https://npm.pkg.github.com/$scope`.split(" "), { cwd: pDir });
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
exports.manageModule = manageModule;
function copyOrModify(srcPath, dstPath, transformer) {
    // tslint:disable: tsr-detect-non-literal-fs-filename
    if (!fs.statSync(srcPath).isFile()) {
        throw new Error(`copyOnModify only supports copying files`);
    }
    const src = fs.readFileSync(srcPath, "utf8");
    fs.ensureFileSync(dstPath);
    const dst = transformer(src, fs.readFileSync(dstPath, "utf8"), dstPath);
    fs.writeFileSync(dstPath, dst, "utf8");
}
function mergeREADME(scope, name, description) {
    const replacers = [
        scope.match(/^@/)
            ? {
                // first replace the npm-scoped tufan-io
                match: /@tufan-io\//g,
                replace: scope,
            } :
            null,
        {
            // then replace tufan-io that might exist otherwise
            match: /tufan-io/g,
            replace: scope.replace(/^@/, ""),
        }, {
            match: /simple-ci/g,
            replace: name,
        },
        !!description
            ? {
                match: new RegExp("> TODO: Describe your module here"),
                replace: description,
            }
            : null
    ].filter((x) => !!x);
    return (src, dst, _dstFile) => {
        return !!dst
            ? dst
            : regexp_replacer_1.regexpReplacer(src, replacers);
    };
}
function mergeLicense(isPrivate, root) {
    const license = (isPrivate)
        ? fs.readFileSync(`${root}/docs/PRIVATE-LICENSE`, "utf8")
        : fs.readFileSync(`${root}/LICENSE`, "utf8");
    return (_src, _dst, _dstFile) => license;
}
function mergePackageJson(scope, name, description, isPrivate, registry, version) {
    return (srcStr, dstStr, _dstFile) => {
        const src = JSON.parse(srcStr);
        const dst = JSON.parse(dstStr);
        dst[`run-batch`] = src[`run-batch`];
        dst.name = scope.match(/^@/) ? `${scope}/${name}` : name;
        dst.description = description;
        dst.engines = src.engines;
        dst.publishConfig = src.publishConfig;
        dst.ava = src.ava;
        dst.nyc = src.nyc;
        dst.husky = src.husky;
        dst.config = src.config; // commitzen
        dst.commitlint = src.commitlint;
        dst.scripts = src.scripts;
        dst.scripts["dep-check"] = "dependency-check . --no-dev";
        dst.files = ["dist", "docs"];
        delete dst.scripts.postintall;
        if (isPrivate) {
            dst.license = "SEE LICENSE IN './LICENSE'";
        }
        else {
            // setting private=true prevent the package from being published.
            // setting private=false doesn't but improves the UX on the interactive prompt
            dst.private = false;
            dst.license = "Apache-2.0";
        }
        dst.publishConfig = { registry };
        dst["simple-ci"] = { version };
        // this changes any git urls embedded in package.json
        const serialized = JSON.stringify(dst, null, 2);
        regexp_replacer_1.regexpReplacer(serialized, [{
                match: /tufan-io/g,
                replace: scope.replace(/^@/, ""),
            }, {
                match: /simple-ci/g,
                replace: name,
            }]);
        return serialized;
        // possibly deal with version upgrades here.
    };
}
function mergeActionCiYml(root, scope) {
    return (src, _dst, _dstFile) => regexp_replacer_1.regexpReplacer(src, [{
            match: /tufan-io/g,
            replace: scope.replace(/^@/, ""),
        }]);
}
function spawn(cmd, args, opts = {}) {
    opts = {
        cwd: process.cwd(),
        stdio: "inherit",
        ...opts,
    };
    // tslint:disable-next-line: no-console
    console.log([cmd].concat(args).join(" "));
    return cp.spawnSync(cmd, args, opts);
}
//# sourceMappingURL=manage-module.js.map