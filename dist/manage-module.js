"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const pkg_dir_1 = require("pkg-dir");
const regexp_replacer_1 = require("./regexp-replacer");
const identityTransform = (src, _dst, _dstFile) => src;
function manageModule(scope, name, description, isPrivate, cwd = process.cwd()) {
    const pDir = pkg_dir_1.default.sync(cwd);
    const root = path.resolve(`${__dirname}/..`);
    if (pDir === root) {
        return;
    }
    const files = [
        [`docs/DevTools.md`, identityTransform],
        [`LICENSE`, mergeLicense(isPrivate, root)],
        [`package.json`, mergePackageJson(scope, name, description, isPrivate)],
        [`README.md`, mergeREADME(scope, name, description)],
        [`templates/.editorconfig`, identityTransform],
        [`templates/.github/workflows/simple-ci.yml`, identityTransform],
        [`templates/_gitignore`, identityTransform],
        [`templates/_npmignore`, identityTransform],
        [`templates/.vscode/launch.json`, identityTransform],
        [`templates/.vscode/settings.json`, identityTransform],
        [`templates/.vscode/tasks.json`, identityTransform],
        [`templates/code-of-conduct.md`, identityTransform],
        [`templates/tsconfig.json`, identityTransform],
        [`templates/tslint.json`, identityTransform],
    ];
    files.forEach(([relativeFpath, transformer]) => {
        console.log(`${root}/${relativeFpath} -> ${pDir}/${relativeFpath.replace("templates/", "")}`);
        copyOrModify(`${root}/${relativeFpath}`, `${pDir}/${relativeFpath.replace("templates/", "")}`, transformer);
    });
    fs.moveSync(`${pDir}/_gitignore`, `${pDir}/.gitignore`);
    fs.moveSync(`${pDir}/_npmignore`, `${pDir}/.npmignore`);
    if (scope) {
        spawn("npm", `config set @${scope}:registry https://npm.pkg.github.com/$scope`.split(" "), { cwd: pDir });
    }
    if (!fs.pathExistsSync(`${pDir}/src`)) {
        fs.ensureDirSync(`${pDir}/src/test`);
        const sample = {
            src: [
                "export function main() {",
                "  console.log(\"tufan.io wishes you have an awesome day!\");",
                "}",
                "",
            ].join("\n"),
            test: [
                "import test from \"ava\";",
                "test(\"simple\", async (t) => {",
                "  t.pass();",
                "});",
                "",
            ].join("\n"),
        };
        fs.writeFileSync(`${pDir}/src/index.ts`, sample.src, "utf8");
        fs.writeFileSync(`${pDir}/src/test/index.ts`, sample.test, "utf8");
    }
}
exports.manageModule = manageModule;
function copyOrModify(srcPath, dstPath, transformer) {
    if (!fs.statSync(srcPath).isFile()) {
        throw new Error(`copyOnModify only supports copying files`);
    }
    const src = fs.readFileSync(srcPath, "utf8");
    fs.ensureFileSync(dstPath);
    const dst = transformer(src, fs.readFileSync(dstPath, "utf8"), dstPath);
    fs.writeFileSync(dstPath, dst, "utf8");
}
function mergeREADME(scope, name, description) {
    return (src, dst, _dstFile) => {
        return !!dst
            ? dst
            : regexp_replacer_1.regexpReplacer(src, [{
                    match: /tufan-io/g,
                    replace: scope,
                }, {
                    match: /dev-tooling/g,
                    replace: name,
                }, {
                    match: new RegExp("[TODO: Describe your module here]"),
                    replace: description,
                }]);
    };
}
function mergeLicense(isPrivate, root) {
    const license = (isPrivate)
        ? fs.readFileSync(`${root}/docs/PRIVATE-LICENSE`, "utf8")
        : fs.readFileSync(`${root}/LICENSE`, "utf8");
    return (_src, _dst, _dstFile) => license;
}
function mergePackageJson(scope, name, description, isPrivate) {
    return (srcStr, dstStr, _dstFile) => {
        const src = JSON.parse(srcStr);
        const dst = JSON.parse(dstStr);
        if (!("dev-tooling" in dst)) {
            dst[`run-batch`] = src[`run-batch`];
            dst.name = name;
            dst.description = description;
            dst.engines = src.engines;
            dst.publishConfig = src.publishConfig;
            dst.ava = src.ava;
            dst.nyc = src.nyc;
            dst.husky = src.husky;
            dst.config = src.config;
            dst.scripts = src.scripts;
            dst.scripts["dep-check"] = `"dependency-check . --no-dev",`;
            dst.files = ["dist", "docs"];
            delete dst.scripts.postintall;
            if (isPrivate) {
                dst.license = "SEE LICENSE IN './LICENSE'";
            }
            else {
                dst.license = "Apache-2.0";
            }
            const serialized = JSON.stringify(dst, null, 2);
            regexp_replacer_1.regexpReplacer(serialized, [{
                    match: /tufan-io/g,
                    replace: scope,
                }, {
                    match: /dev-tooling/g,
                    replace: name,
                }]);
            dst["dev-tooling"] = {
                version: src.version,
            };
            return serialized;
        }
    };
}
function spawn(cmd, args, opts = {}) {
    opts = {
        cwd: process.cwd(),
        stdio: "inherit",
        ...opts,
    };
    console.log([cmd].concat(args).join(" "));
    return cp.spawnSync(cmd, args, opts);
}
//# sourceMappingURL=manage-module.js.map