"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = void 0;
const questions = (name, description, isPrivate, registry) => {
    // tslint:disable: object-literal-sort-keys
    return [
        {
            type: "text",
            name: "pkgname",
            message: "npm module name (with scope): ",
            default: name,
            validate: (val) => val.match(/.+\/.+/)
                ? true
                : "module name must be of form 'scope/name' or '@scope/name'",
        },
        {
            type: "text",
            name: "description",
            message: "description of what it does: ",
            default: description || "",
        },
        {
            type: "list",
            name: "isPrivate",
            message: "is this a private module? ",
            choices: [
                { name: "true", value: true },
                { name: "false", value: false },
            ],
            default: isPrivate,
        },
        {
            type: "list",
            name: "registry",
            message: "which registry is this module published to? ",
            default: (ans) => registry
                ? registry
                : ans.isPrivate === true
                    ? // tslint:disable-next-line: no-duplicate-string
                        "https://npm.pkg.github.com"
                    : "https://registry.npmjs.org",
            choices: [
                { name: "github", value: "https://npm.pkg.github.com" },
                { name: "npm", value: "https://registry.npmjs.org" },
            ],
        },
        {
            when: (ans) => ans.registry === "https://npm.pkg.github.com" && ans.pkgname[0] !== "@",
            type: "text",
            name: "pkgname1",
            message: "npm module name (needs scope): ",
            default: (ans) => ans.pkgname,
            validate: (val, ans) => ans.registry === "https://npm.pkg.github.com" && !!val.match(/^@.*\/.*/)
                ? true
                : "Module hosted on github must be of form '@scope/name'",
        },
    ];
};
exports.questions = questions;
//# sourceMappingURL=questions.js.map