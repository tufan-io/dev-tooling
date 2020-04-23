#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = require("inquirer");
const manage_module_1 = require("./manage-module");
const questions_1 = require("./questions");
function main(cwd = process.cwd()) {
    console.log({ cwd });
    return inquirer_1.prompt(questions_1.questions(cwd))
        .then(({ name, description, isPrivate, ...rest }) => {
        console.log({ name, description, isPrivate, rest });
        const parts = ["", ...name.split("/")].slice(-2);
        const scope = parts[0];
        name = parts[1];
        return manage_module_1.manageModule(scope, name, description, isPrivate, cwd);
    });
}
exports.main = main;
if (!module.parent) {
    process.on("SIGINT", () => process.exit(-1));
    main(process.cwd()).then(console.log).catch(console.error);
}
//# sourceMappingURL=index.js.map