import { QuestionCollection } from "inquirer";
import readPkgUp = require("read-pkg-up");

export const questions = (cwd: string): QuestionCollection => {
  const { pkg: { name, description } } = readPkgUp.sync({ cwd });
  return [{
    default: name,
    format: (val) =>
      !!val && val.test("/") && val[0] !== "@" ? `@${val}` : val,
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
