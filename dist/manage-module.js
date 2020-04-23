"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const pkg_dir_1 = require("pkg-dir");
const regexp_replacer_1 = require("./regexp-replacer");
const identityTransform = (_src, dst, _dstFile) => dst;
function manageModule(scope, name, description, isPrivate, cwd = process.cwd()) {
    const pDir = pkg_dir_1.default.sync(cwd);
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
    files.forEach(([relativeFpath, transformer]) => copyOrModify(`${root}/${relativeFpath}`, `${pDir}/${relativeFpath}`, transformer));
    spawn("npm", `config set @${scope}:registry https://npm.pkg.github.com/$scope`.split(" "), { cwd: pDir });
}
exports.manageModule = manageModule;
function copyOrModify(srcPath, dstPath, transformer) {
    if (!fs.statSync(srcPath).isFile()) {
        throw new Error(`copyOnModify only supports copying files`);
    }
    if (fs.existsSync(dstPath)) {
        const src = fs.readFileSync(srcPath, "utf8");
        const dst = transformer(src, fs.readFileSync(dstPath, "utf8"), dstPath);
        fs.writeFileSync(dstPath, dst, "utf8");
    }
    else {
        fs.ensureDirSync(path.dirname(dstPath));
        fs.copySync(srcPath, dstPath);
    }
}
function mergeREADME(scope, name, description) {
    return (_src, dst, _dstFile) => {
        dst = regexp_replacer_1.regexpReplacer(dst, [{
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
    };
}
function mergeLicense(isPrivate, root) {
    return (_src, _dst, _dstFile) => (isPrivate)
        ? fs.readFileSync(`${root}/docs/PRIVATE-LICENSE`, "utf8")
        : fs.readFileSync(`${root}/LICENSE`, "utf8");
}
function mergePackageJson(scope, name, description, isPrivate) {
    return (srcStr, dstStr, _dstFile) => {
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
        return serialized;
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