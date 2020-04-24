"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = (name, description) => {
    // tslint:disable: object-literal-sort-keys
    return [{
            type: "text",
            name: "pkgname",
            message: "npm module name (with scope): ",
            default: name,
            format: (val) => !!val && val.test("/") && val[0] !== "@" ? `@${val}` : val,
            validate: (val) => !!val.match(/^@.*\/.*/)
        }, {
            type: "text",
            name: "description",
            message: "description of what it does: ",
            default: description || "",
        }, {
            type: "list",
            name: "isPrivate",
            message: "is this a private module? ",
            choices: [
                { name: "true", value: true },
                { name: "false", value: false },
            ],
            default: true,
        }];
};
//# sourceMappingURL=questions.js.map