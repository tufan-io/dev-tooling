#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = require("inquirer");
const path = tslib_1.__importStar(require("path"));
const readPkgUp = tslib_1.__importStar(require("read-pkg-up"));
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const manage_module_1 = require("./manage-module");
const questions_1 = require("./questions");
function main({ cwd = process.cwd(), name, githubOrg, description, isPrivate, registry, force = false, }) {
    const packageJson = {
        name,
        description,
        private: !!isPrivate,
        ...readPkgUp.sync({ cwd }).packageJson,
    };
    const p = packageJson;
    registry = registry || `${p?.publishConfig?.registry}`;
    githubOrg = githubOrg || p?.repository?.url.split("/").slice(-2)[0];
    name = name || packageJson.name;
    const pkgname = !/\//.test(name) && !!githubOrg ? `${githubOrg}/${packageJson.name}` : name;
    return (new Promise((resolve, reject) => {
        if (force) {
            if (!githubOrg && !/\//.test(name)) {
                // we have a problem - in forced mode
                throw new Error(`Missing githubOrg. Provide it, or add repository config to package.json`);
            }
            resolve({
                pkgname,
                description: packageJson.description,
                isPrivate: packageJson.private !== false,
                registry,
            });
        }
        else {
            const qs = questions_1.questions(pkgname, packageJson.description, packageJson.private !== false, registry);
            inquirer_1.prompt(qs).then(resolve).catch(reject);
        }
    })
        // tslint:disable-next-line: no-shadowed-variable
        .then(({ pkgname, description, isPrivate, registry, pkgname1 }) => {
        // tslint:disable-next-line: no-shadowed-variable
        const [scope, name] = [
            "tufan-io",
            ...(pkgname1 || pkgname).split("/"),
        ].slice(-2);
        return manage_module_1.manageModule(scope, name, description, isPrivate, registry, cwd);
    }));
}
exports.main = main;
if (!module.parent) {
    process.on("SIGINT", () => process.exit(-1));
    // tslint:disable-next-line: no-unused-expression
    yargs_1.default
        .scriptName("simple-ci")
        .usage("$0 <cmd> [args]")
        .command("config [dir]", "(re)configures simple-ci over an npm module", (_yargs) => {
        _yargs
            .positional("dir", {
            type: "string",
            default: ".",
            describe: "npm module directory",
        })
            .option("name", {
            type: "string",
            alias: ["n"],
            describe: "npm module name 'git-org/name' or '@scope/name'",
        })
            .option("github-org", {
            type: "string",
            alias: ["g"],
            describe: "github-org",
        })
            .option("description", {
            type: "string",
            alias: ["d", "desc"],
            describe: "short text about what the module does",
        })
            .option("private", {
            type: "boolean",
            alias: ["p", "priv"],
            default: false,
            describe: "is module private",
        })
            .option("registry", {
            type: "string",
            alias: ["r", "reg"],
            describe: "npm registry to use. registry.npm.org/npm.pkg.github.com",
        })
            .option("force", {
            type: "boolean",
            alias: ["f"],
            describe: "force non-interactive mode",
        });
        // tslint:disable-next-line: only-arrow-functions
    }, (argv) => {
        const { dir, name, description, githubOrg, private: isPrivate, registry, force = false, } = argv;
        // tslint:disable: no-console
        main({
            cwd: path.resolve(dir),
            name,
            githubOrg,
            description,
            isPrivate,
            registry,
            force,
        })
            .then(() => {
            console.log(`\nSuccessfully configured 'simple-ci'. To finish, execute\n  npm run build`);
        })
            .catch(console.error);
    })
        .help()
        .alias("help", "h")
        .showHelpOnFail(true)
        .recommendCommands().argv;
}
//# sourceMappingURL=index.js.map