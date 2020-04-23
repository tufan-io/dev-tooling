export declare const questions: (name: string, description: string) => ({
    type: string;
    name: string;
    message: string;
    default: string;
    format: (val: any) => any;
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: string;
    format?: undefined;
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
})[];
