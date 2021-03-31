import inquirer from "inquirer";
export declare const questions: (name: string, description: string, isPrivate: boolean, registry: string) => inquirer.QuestionCollection<unknown>;
