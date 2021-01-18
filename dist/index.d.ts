#!/usr/bin/env node --harmony-optional-chaining
export declare function main({ cwd, name, githubOrg, description, isPrivate, registry, force, }: {
    cwd: string;
    name?: string;
    githubOrg?: string;
    description?: string;
    isPrivate?: boolean;
    registry?: string;
    force: boolean;
}): Promise<void>;
