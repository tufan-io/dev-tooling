"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readPkgUp = require("read-pkg-up");
exports.questions = (cwd) => {
    const { pkg: { name, description } } = readPkgUp.sync({ cwd });
    return [{
            default: name,
            format: (val) => !!val && val.test("/") && val[0] !== "@" ? `@${val}` : val,
            message: "npm module name",
            name: "name",
            type: "text",
        }, {
            default: description,
            message: "description of what it does:",
            name: "description",
            type: "text",
        }, {
            choices: [
                true,
                false,
            ],
            default: true,
            message: "is this a private module?",
            name: "isPrivate",
            type: "list",
        }];
};
//# sourceMappingURL=questions.js.map