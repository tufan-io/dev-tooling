export declare const questions: (name: string, description: string, isPrivate: any, registry: any) => ({
    type: string;
    name: string;
    message: string;
    default: string;
    validate: (val: any) => true | "module name must be of form 'scope/name' or '@scope/name'";
    choices?: undefined;
    when?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: string;
    validate?: undefined;
    choices?: undefined;
    when?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: {
        name: string;
        value: boolean;
    }[];
    default: any;
    validate?: undefined;
    when?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: (ans: any) => any;
    choices: {
        name: string;
        value: string;
    }[];
    validate?: undefined;
    when?: undefined;
} | {
    when: (ans: any) => boolean;
    type: string;
    name: string;
    message: string;
    default: (ans: any) => any;
    validate: (val: any, ans: any) => true | "Module hosted on github must be of form '@scope/name'";
    choices?: undefined;
})[];
