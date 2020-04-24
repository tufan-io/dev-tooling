export declare const questions: (name: string, description: string) => ({
    type: string;
    name: string;
    message: string;
    default: string;
    format: (val: any) => any;
    validate: (val: any) => true | "Module names should be of form '@scope/name'";
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: string;
    format?: undefined;
    validate?: undefined;
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: {
        name: string;
        value: boolean;
    }[];
    default: boolean;
    format?: undefined;
    validate?: undefined;
})[];
